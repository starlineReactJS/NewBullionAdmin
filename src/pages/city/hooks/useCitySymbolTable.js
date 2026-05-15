import { useCallback, useMemo } from "react";
import { toastFn, validatePremium } from "@/utils";

export const useCitySymbolTable = ({
    citySymbols,
    setCitySymbols,
    saveSymbolApiCall,
    selectedCityId,
    actionLoading,
    setActionLoading,
    refreshData
}) => {

    // ✅ O(1) lookup
    const symbolMap = useMemo(() => {
        return Object.fromEntries(citySymbols.map(s => [s.id, s]));
    }, [citySymbols]);

    const handleSymbolUpdate = useCallback((id, key, value) => {
        setCitySymbols(prev =>
            prev.map(s => (s.id === id ? { ...s, [key]: value } : s))
        );
    }, [setCitySymbols]);

    const checkValidation = useCallback((row) => {
        return validatePremium(row.buyPremium) &&
            validatePremium(row.sellPremium);
    }, []);

    const handleSaveSymbol = useCallback(async (id) => {

        if (actionLoading.rowSaveId === id) return;

        const data = symbolMap[id];

        if (!data || !checkValidation(data)) {
            toastFn("error", "Invalid values");
            return;
        }

        const payload = {
            cityId: selectedCityId,
            symbolId: data.symbolId,
            buyPremium: data.buyPremium,
            sellPremium: data.sellPremium,
            isView: data.isView,
            ...(Number.isInteger(data?.id) && { id: data.id })
        };

        setActionLoading(prev => ({ ...prev, rowSaveId: id }));

        try {
            const res = await saveSymbolApiCall(payload);

            if (res?.success) {
                toastFn("success", "Saved successfully");
                refreshData();
            } else {
                toastFn("error", res?.message);
            }

        } catch {
            toastFn("error", "Save failed");
        } finally {
            setActionLoading(prev => ({ ...prev, rowSaveId: null }));
        }

    }, [symbolMap, selectedCityId, actionLoading.rowSaveId, refreshData]);

    return {
        handleSymbolUpdate,
        handleSaveSymbol,
        checkValidation
    };
};