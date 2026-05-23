import React, { useContext, useMemo, useState, useEffect, useCallback } from "react";
import { isBankObjValid, toastFn } from '@/utils';
import { getCostingBankdetail, saveOrEditCostingRate } from "../../ApiServices/services";
import Skeleton from "../../common/components/skeleton";
import { inrJSON, BANK_RATE_DEFAULT_VALUES, SPOT_OPTIONS, EXCHANGE_OPTIONS, NON_NUMERIC_FIELDS } from "../../constants/bankRate";
// import { sourceContext } from "../../layout/AdminBullionLayout";
import { useSelector } from "react-redux";
import { rateStore } from "../../socketStore/rateStore";
import LiverateSocket from "../../socketHandler/LiverateSocket";
import { useCostingCalculations } from "../../common/hooks/useCostingCalculations";
import CostingTable from "./CostingTable ";
import { useAuth } from "../../context/AuthContext";

const chunkArray = (arr, size) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

const getMetalType = (value = "") => {
  const v = value.toUpperCase();
  if (v.includes("GOLD")) return "GOLD";
  if (v.includes("SILVER")) return "SILVER";
  return "GOLD"; // safe default
};

const Costing = () => {
  const [bankObj, setBankObj] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [disabledButton, setDisabledButton] = useState(null);
  const [rate, setRate] = useState([]);
  const subscriptionsRef = React.useRef({});
  const rateBufferRef = React.useRef({});
  const lastUpdateRef = React.useRef({});
  const THROTTLE_MS = 150;
  const { auth } = useAuth();

  // const subscribeInstrument = (instrument) => {
  //   if (!instrument || subscriptionsRef.current[instrument]) return;

  //   const unsub = rateStore.subscribe(instrument, (r) => {
  //     // 1️⃣ always keep latest tick
  //     rateBufferRef.current[r.instrument] = r;

  //     const now = Date.now();
  //     if (now - lastUpdateRef.current < THROTTLE_MS) return;

  //     lastUpdateRef.current = now;

  //     // 2️⃣ flush buffered ticks
  //     setRate((prev) => {
  //       const updated = [...prev];

  //       Object.values(rateBufferRef.current).forEach((tick) => {
  //         const i = updated.findIndex((x) => x.instrument === tick.instrument);

  //         if (i !== -1) {
  //           updated[i] = tick;
  //         } else {
  //           updated.push(tick);
  //         }
  //       });

  //       return updated;
  //     });
  //   });
  //   subscriptionsRef.current[instrument] = unsub;
  // };

  
  const subscribeInstrument = (instrument) => {
    if (!instrument || subscriptionsRef.current[instrument]) return;

    const unsub = rateStore.subscribe(instrument, (r) => {
      // 1️⃣ always keep latest tick
      rateBufferRef.current[r.instrument] = r;

      const now = Date.now();
      // if (now - lastUpdateRef.current  < THROTTLE_MS) return;
      // lastUpdateRef.current = now;
      if (lastUpdateRef.current[instrument] && now - lastUpdateRef.current[instrument] < THROTTLE_MS) return;
      lastUpdateRef.current[instrument] = now;

      // 2️⃣ flush buffered ticks
      setRate((prev) => {
        const updated = [...prev];
        // Object.values(rateBufferRef.current).forEach((tick) => {
        //   const i = updated.findIndex((x) => x.instrument === tick.instrument);
        //   if (i !== -1) {
        //     updated[i] = tick;
        //   } else {
        //     updated.push(tick);
        //   }
        // });
        const allTicks = Object.values(rateBufferRef.current);
        return allTicks;
      });
    });
    subscriptionsRef.current[instrument] = unsub;
  };

  const unsubscribeInstrument = (instrument) => {
    if (subscriptionsRef.current[instrument]) {
      subscriptionsRef.current[instrument]();
      delete subscriptionsRef.current[instrument];
    }
  };

  const { computedRows } = useCostingCalculations(bankObj, rate);

  useEffect(() => {
    if (!bankObj.length) return;

    const activeInstruments = new Set();

    bankObj.forEach((row) => {
      if (row?.spot) {
        activeInstruments.add(row.spot);
      }
      if (row?.exchange) {
        activeInstruments.add(row.exchange);
      }
      if (row?.inr) {
        activeInstruments.add(row.inr);
      }
    });

    activeInstruments.forEach((instrument) => {
      if (!subscriptionsRef.current[instrument]) {
        subscribeInstrument(instrument);
      }
    });

    Object.keys(subscriptionsRef.current).forEach((instrument) => {
      if (!activeInstruments.has(instrument)) {
        unsubscribeInstrument(instrument);
      }
    });
  }, [bankObj]);

  // useEffect(() => {
  //   if (!bankObj.length) return;

  //   // collect all selected INR instruments
  //   const selectedInrInstruments = new Set();

  //   bankObj.forEach((row) => {
  //     if (row?.inr) {
  //       selectedInrInstruments.add(row.inr);
  //     }
  //   });

  //   // unsubscribe INR instruments that are NOT selected
  //   Object.values(inrJSON).forEach((instrument) => {
  //     if (!selectedInrInstruments.has(instrument)) {
  //       unsubscribeInstrument(instrument);
  //     }
  //   });

  //   // subscribe currently selected INR instruments
  //   selectedInrInstruments.forEach((instrument) => {
  //     subscribeInstrument(instrument);
  //   });

  // }, [bankObj]);


  const getBankRate = async () => {
    setIsLoading(true);
    try {
      const res = await getCostingBankdetail();
      if (Array.isArray(res?.data)) {
        const sortedData = [...res?.data].sort(
          (a, b) => Number(a.index) - Number(b.index)
        );

        const updated = sortedData.map((item) => {
          const metal = getMetalType(item.spot);

          return {
            // ✅ defaults first
            ...BANK_RATE_DEFAULT_VALUES,
            id: item.id,
            source: item.source,
            index: item.index,
            spot: item?.spot ?? SPOT_OPTIONS[metal][0].value,
            exchange: item?.exchange ?? EXCHANGE_OPTIONS[metal][0].value,
            inr: item.inr ?? "INRSPOT_I",
            premium: item.premium,
            interBank: item.interBank,
            conversion: item.conversion,
            customDuty: item.customDuty,
            margin: item.margin,
            gst: item.gst,
            tds: item.tds,
            tcs: item.tcs,
            division: item.division,
            multiply: item.multiply,
          };
        });

        setBankObj(updated);
      }
    } catch (error) {
      console.error("error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBankRate();
  }, []);

  const handleChange = useCallback((e, id) => {
    const { name, value } = e.target;
    if (!NON_NUMERIC_FIELDS.includes(name)) {
      if (value !== "" && !/^-?\d*\.?\d*$/.test(value)) return;
    }

    setBankObj((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [name]: value } : item
      )
    );
  }, []);

  const handleSubmit = async (id) => {
    if (disabledButton === id) return;
    // 1️⃣ Basic guard
    if (!Array.isArray(bankObj) || bankObj.length === 0) {
      toastFn("error", "No data to submit");
      return;
    }

    // 2️⃣ Validate all rows
    const invalidRow = bankObj.find((row) => !isBankObjValid(row));
    if (invalidRow) {
      toastFn("error", `All fields are required (ID: ${invalidRow.id})`);
      return;
    }
    setDisabledButton(id);

    try {
      // 4️⃣ Build ARRAY payload
      const payload = bankObj.map((row) => ({
        id: row.id,
        source: row.source,
        index: row.index,
        spot: row.spot,
        exchange: row.exchange,
        inr: row.inr,
        premium: row.premium,
        margin: Number(row.margin),
        gst: Number(row.gst),
        customDuty: Number(row.customDuty),
        conversion: Number(row.conversion),
        interBank: Number(row.interBank),
        multiply: Number(row.multiply),
        division: Number(row.division),
        tds: Number(row?.tds),
        tcs: Number(row?.tcs),
        user: auth?.name
      }));
      // 5️⃣ API call (ARRAY)
      const response = await saveOrEditCostingRate(payload);

      if (!response?.success) {
        toastFn("error", "Failed to save rates");
        return;
      }

      toastFn("success", "All costing rates saved successfully");
    } catch (error) {
      console.error(error);
      toastFn("error", "Something went wrong");
    } finally {
      setDisabledButton(null);
    }
  };

  const bankChunks = useMemo(() => {
    return chunkArray(bankObj, 6);
  }, [bankObj]);


  if (isLoading) {
    return (
      <div className="col-lg-12 col-md-12 pl-2 pt-4">
        <Skeleton height={"250px"} />
      </div>
    );
  }

  return (
    <>

      <LiverateSocket />
      {bankChunks?.length > 0 ? (
        bankChunks.map((chunk, index) => (
          <CostingTable
            key={index}
            chunk={chunk}
            computedRows={computedRows}
            onChange={handleChange}
            onSubmit={handleSubmit}
            disabledButton={disabledButton}
          />
        ))
      ) : (
        <EmptyStateWrapper>
          No source configured for Bank Rate.
        </EmptyStateWrapper>
      )}
    </>

  );
};

export default Costing;

