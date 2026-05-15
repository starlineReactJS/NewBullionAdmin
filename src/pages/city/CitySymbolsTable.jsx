import React, { memo, useEffect, useState, useCallback, useMemo } from "react";
import { getSymboldetail, getCitySymbols, saveUpdateCitySymbol } from "../../ApiServices/services";
import { useCitySymbolTable } from "./hooks/useCitySymbolTable";
import SortableTable from "../../common/components/sortTable";
import { toastFn } from "@/utils";
import styled from "styled-components";
import {
  PrimaryButton,
  Checkbox,
  Input,
  fluidType,
} from "../../common/styledComponents";

// ─────────────────────────────────────────────────────────────────────────────
// Local styles
// ─────────────────────────────────────────────────────────────────────────────

const CITY_SYMBOL_COLS = ["SymbolName", "BuyPremium", "SellPremium", "IsView", "Save"];

const SymbolName = styled.p`
  ${fluidType("bodySm")}
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightSemiBold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const PremiumInput = styled(Input)`
  width: 100%;
  text-align: center;
`;

const SaveBtn = styled(PrimaryButton)`
  padding: 5px 12px;
  font-size: ${({ theme }) => theme.font.sizeMd};
  min-width: 58px;
`;

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const CitySymbolsTable = memo(({ selectedCityId }) => {
  const visibleColumns = useMemo(() => ({
    SymbolName: true, BuyPremium: true, SellPremium: true, IsView: true, Save: true,
  }), []);

  const [isLoading,     setIsLoading]     = useState(false);
  const [symbols,       setSymbols]       = useState([]);
  const [globalSymbols, setGlobalSymbols] = useState([]);
  const [actionLoading, setActionLoading] = useState({ rowSaveId: null });

  // Load global symbols (logic untouched)
  useEffect(() => {
    const fetchGlobal = async () => {
      try {
        const res = await getSymboldetail();
        if (res?.success) {
          const data = (Array.isArray(res.data) ? res.data : [res.data])
            .filter((i) => i?.isView === true)
            .map((i) => ({ id: Number(i.id), name: i.name }));
          setGlobalSymbols(data);
        }
      } catch {
        toastFn("error", "Failed to load symbols");
      }
    };
    fetchGlobal();
  }, []);

  const getCitySymbolData = useCallback(async () => {
    if (!selectedCityId || !globalSymbols.length) return;
    setIsLoading(true);
    try {
      const res = await getCitySymbols({ cityId: selectedCityId });
      const cityData = res?.success && res.data
        ? (Array.isArray(res.data) ? res.data : [res.data])
        : [];
      const cityMap = {};
      cityData.forEach((item) => { cityMap[Number(item.symbolId)] = item; });
      const merged = globalSymbols.map((gs) => {
        const match = cityMap[gs.id];
        return {
          id:          match?.id ?? `new-${gs.id}`,
          symbolId:    gs.id,
          name:        gs.name,
          cityId:      selectedCityId,
          buyPremium:  match?.buyPremium  ?? "0",
          sellPremium: match?.sellPremium ?? "0",
          isView:      match?.isView      ?? false,
        };
      });
      setSymbols(merged);
    } catch {
      toastFn("error", "Failed to load city data");
    } finally {
      setIsLoading(false);
    }
  }, [selectedCityId, globalSymbols]);

  useEffect(() => {
    if (selectedCityId && globalSymbols.length) getCitySymbolData();
  }, [selectedCityId, globalSymbols.length]);

  const { handleSymbolUpdate, handleSaveSymbol } = useCitySymbolTable({
    citySymbols: symbols,
    setCitySymbols: setSymbols,
    saveSymbolApiCall: saveUpdateCitySymbol,
    selectedCityId,
    actionLoading,
    setActionLoading,
    refreshData: getCitySymbolData,
  });

  const handleChange = useCallback(
    (id, key) => (e) => {
      const value = key === "isView" ? e.target.checked : e.target.value;
      handleSymbolUpdate(id, key, value);
    },
    [handleSymbolUpdate]
  );

  const columnRender = useCallback((col, row) => {
    switch (col) {
      case "SymbolName":
        return <SymbolName>{row.name}</SymbolName>;

      case "BuyPremium":
        return (
          <PremiumInput
            value={row.buyPremium}
            onChange={handleChange(row.id, "buyPremium")}
          />
        );

      case "SellPremium":
        return (
          <PremiumInput
            value={row.sellPremium}
            onChange={handleChange(row.id, "sellPremium")}
          />
        );

      case "IsView":
        return (
          <Checkbox
            checked={row.isView}
            onChange={handleChange(row.id, "isView")}
          />
        );

      case "Save":
        return (
          <SaveBtn
            disabled={actionLoading.rowSaveId === row.id}
            onClick={() => handleSaveSymbol(row.id)}
          >
            {actionLoading.rowSaveId === row.id ? "Saving…" : "Save"}
          </SaveBtn>
        );

      default: return null;
    }
  }, [handleChange, handleSaveSymbol, actionLoading.rowSaveId]);

  return (
    <SortableTable
      data={symbols}
      columnOrder={CITY_SYMBOL_COLS}
      visibleColumns={visibleColumns}
      isLoading={isLoading}
      columnRender={columnRender}
      enableColumnDrag={false}
    />
  );
});

export default CitySymbolsTable;