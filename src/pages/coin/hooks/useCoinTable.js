import { useCallback, useMemo } from "react";
import { toastFn } from "@/utils";

export const useCoinTable = ({
    coins,
    setCoins,
    saveCoinApiCall,
    checkValidation,
    actionLoading,
    setActionLoading,
    saveDataIds,
    setSaveDataIds,
    getCoinData
}) => {

    const coinsById = useMemo(() => {
        const map = {};
        coins.forEach(c => {
            map[c.id] = c;
        });
        return map;
    }, [coins]);

    const handleSymbolUpdate = useCallback((id, key, value) => {

        setCoins((prev) =>
            prev.map((s) => {
                if (s.id !== id) return s;

                // Handle premium keys separately
                if (key === "premium") {
                    const premium = Array.isArray(s.premium) ? [...s.premium] : [];
                    premium[value.index] = value.value;

                    return {
                        ...s,
                        premium,
                    };
                }

                // Handle all other keys normally
                return {
                    ...s,
                    [key]: value,
                };
            })
        );

        setSaveDataIds((prev) => new Set(prev).add(id));
    }, [setCoins, setSaveDataIds]);

    const handleSaveCoin = useCallback(async (id) => {
        if (actionLoading.rowSaveId === id) return;

        const data = coinsById[id];
        if (!data || !checkValidation(data)) return;

        setActionLoading(p => ({ ...p, rowSaveId: id }));

        try {
            const response = await saveCoinApiCall("", data);

            response?.success
                ? toastFn("success", "Coin saved successfully")
                : toastFn("error", response?.message || "Save failed");
        } catch (e) {
            console.error(e);
        } finally {
            setActionLoading(p => ({ ...p, rowSaveId: null }));
        }
    }, [coinsById, saveCoinApiCall, checkValidation]);

    const saveAll = useCallback(async () => {
        if (!saveDataIds.size) {
            toastFn('error', "No changes found!");
            return;
        }
        if (actionLoading.saveAll) return;
        
        setActionLoading(p => ({ ...p, saveAll: true }));
        
        try {
            const promises = [...saveDataIds].map((id) =>
                saveCoinApiCall("", coinsById[id])
            );
            const results = await Promise.allSettled(promises);
            const failedCount = results.filter((r) => r.status === "rejected")?.length;

            failedCount === 0
                ? toastFn("success", "All coin changes saved successfully")
                : toastFn("error", `Failed to saved ${failedCount} coin`)

            setSaveDataIds(new Set());
        } finally {
            setActionLoading(p => ({ ...p, saveAll: false }));
        }
    }, [coinsById, saveCoinApiCall, saveDataIds]);

    const changeRateType = useCallback(async (type) => {
        if (actionLoading.rateType) return;

        setActionLoading(p => ({ ...p, rateType: true }));
        try {
            // parallel api call
            const promises = coins.map(item =>
                saveCoinApiCall("", { ...item, rateType: type })
            );

            // wait for all APIs to finish
            const results = await Promise.allSettled(promises);

            const failedCount = results.filter(r => r.status === "rejected").length;

            if (failedCount === 0) {
                toastFn("success", "Rate type updated successfully");
            } else {
                toastFn("error", `Failed ${failedCount} request,Try again!`)
            }

            getCoinData();
        } catch (error) {
            console.log(error);
        }
        finally {
            setActionLoading(p => ({ ...p, rateType: false }));
        }
    }, [coins, saveCoinApiCall, getCoinData]);

    return {
        coinsById,
        handleSymbolUpdate,
        handleSaveCoin,
        saveAll,
        changeRateType,
    };
};

