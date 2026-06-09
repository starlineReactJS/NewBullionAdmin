import { useCallback, useMemo } from "react";
import { toastFn } from "@/utils";

export const useSymbolTable = ({
    symbols,
    setSymbols,
    saveSymbolApiCall,
    checkValidation,
    actionLoading,
    setActionLoading,
    saveDataIds,
    setSaveDataIds,
    commonPremiumSource,
    getSymbolData
}) => {

    const stepMap = useMemo(() => {
        const map = {};
        commonPremiumSource.forEach(s => {
            map[s.value] = s.step;
        });
        return map;
    }, [commonPremiumSource]);

    const symbolMap = useMemo(() => {
        const map = {};
        symbols.forEach(s => map[s.id] = s);
        return map;
    }, [symbols]);

    const getStepBySource = useCallback(
        (source) => stepMap[source] || 0,
        [stepMap]
    );

    const handleSymbolUpdate = useCallback((id, key, value) => {
        setSymbols(prev =>
            prev.map(s => (s.id === id ? { ...s, [key]: value } : s))
        );

        setSaveDataIds(prev => {
            const newSet = new Set(prev);
            newSet.add(id);
            return newSet;
        });

    }, [setSymbols, setSaveDataIds]);

    const handleSaveSymbol = useCallback(async (id) => {
        if (actionLoading.rowSaveId === id) return;

        setActionLoading(prev => ({ ...prev, rowSaveId: id }));

        const data = symbolMap[id];
        if (!data || !checkValidation(data)) {
            setActionLoading(prev => ({ ...prev, rowSaveId: null }));
            return;
        }

        try {
            const response = await saveSymbolApiCall(data);
            response?.success
                ? toastFn("success", "Symbol Saved Successfully")
                : toastFn("error", response?.message || "Save failed");
        } finally {
            setActionLoading(prev => ({ ...prev, rowSaveId: null }));
        }
    }, [symbolMap, actionLoading.rowSaveId]);

    const saveAll = async () => {
        if (actionLoading.saveAll) return;

        if (!saveDataIds.size) {
            toastFn("error", "No changes found!");
            return;
        }

        setActionLoading(prev => ({ ...prev, saveAll: true }));

        try {
            const promises = [...saveDataIds].map(id =>
                saveSymbolApiCall(symbolMap[id])
            );

            const results = await Promise.allSettled(promises);
            const failedCount = results.filter(r => r.status === "rejected").length;

            failedCount === 0
                ? toastFn("success", "All changes saved successfully")
                : toastFn("error", `Save failures ${failedCount} symbol,Try again!`);

            setSaveDataIds(new Set());
        } finally {
            setActionLoading(prev => ({ ...prev, saveAll: false }));
        }
    };

    const handleStepChange = useCallback((id, field, type, source) => {
        const step = getStepBySource(source);
        setSymbols(prev =>
            prev.map(sym => {
                if (sym.id !== id) return sym;

                const current = Number(sym[field]) || 0;

                const nextValue =
                    type === "inc"
                        ? current + step
                        : current - step;

                return {
                    ...sym,
                    [field]: String(nextValue)
                };
            })
        );
        setSaveDataIds(prev => {
            const newSet = new Set(prev);
            newSet.add(id);
            return newSet;
        });
    }, [getStepBySource]);

    const changeRateType = useCallback(async (type) => {
        if (actionLoading.rateType) return;

        setActionLoading(prev => ({ ...prev, rateType: true }));

        try {
            const promises = symbols.map((item) => {
                const { identifier, ...payload } = item;

                return saveSymbolApiCall({
                    ...payload,
                    rateType: type,
                });
            });

            const results = await Promise.allSettled(promises);
            const failedCount = results.filter(r => r.status === "rejected").length;

            failedCount === 0
                ? toastFn("success", "Rate type updated successfully")
                : toastFn("error", `Failed ${failedCount} request,Try again!`);

            getSymbolData();
        } finally {
            setActionLoading(prev => ({ ...prev, rateType: false }));
        }
    }, [symbols, actionLoading.rateType]);

    return {
        handleSymbolUpdate,
        handleSaveSymbol,
        saveAll,
        handleStepChange,
        changeRateType
    };

};