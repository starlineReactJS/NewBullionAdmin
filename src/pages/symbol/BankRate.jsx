import React, { useContext, useMemo, useState, useEffect, useRef, memo } from "react";
import { isBankObjValid, toastFn } from '@/utils';
import { getSymbolBankRatedetail, saveOrEditSymbolBankRate } from "../../ApiServices/services";
import Skeleton from "../../common/components/skeleton";
import { bankRateRows, inrJSON, BANK_RATE_DEFAULT_VALUES, NON_NUMERIC_FIELDS, getDefaultBySource } from "../../constants/bankRate";
import { sourceContext } from "../../layout/AdminBullionLayout";
import { rateStore } from "../../socketStore/rateStore";
import BankRateRow from "../../common/components/bankRates/BankRateRow ";
import BankRateSpotHeader from "../../common/components/bankRates/BankRateSpotHeader";
import BankRateDifference from "../../common/components/bankRates/BankRateDifference";
import { useBankRateCalculations } from "../../common/hooks/useBankRateCalculations";
import LiverateSocket from "../../socketHandler/LiverateSocket";
import styled from "styled-components";
import {
  PageTitle,
  StyledTable,
  Tbody,
  Tr,
  EmptyStateWrapper,
} from "../../common/styledComponents";
import {BankCard,BankCardHeader,BankTitle,BankTableWrapper,LabelTd,DiffWrapper} from "../../common/styledComponents/symbol"

const goldSources = ["gold999", "gold995"];
const goldSpots = ["GOLDSPOT_I", "GOLDCOMEX_I"];
const goldExchange = ['GOLD_I', 'GOLD_II'];

const silverSources = ["silver"];
const silverSpots = ["SILVERSPOT_I", "SILVERCOMEX_I"];
const silverExchange = ['SILVER_I', 'SILVER_II'];


const BankRate = memo(() => {
  const sourceData = useContext(sourceContext);
  const [bankObj, setBankObj] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [disabledButton, setDisabledButton] = useState({});
  const [rate, setRate] = useState([]);
  const subscriptionsRef = useRef({});
  const prevInstRef = useRef({});
  const rateBufferRef = useRef({});
  const lastUpdateRef = useRef({}); 
  const THROTTLE_MS = 150;

  const bankRateSource = useMemo(
    () =>
      sourceData?.source
        ? sourceData.source.filter((item) => item?.isBankRate)
        : [],
    [sourceData],
  );

  const subscribeInstrument = (instrument) => {
    // console.log('subscribeInstrument : ',subscriptionsRef.current)
    if (!instrument || subscriptionsRef.current[instrument]) return;
    
    const unsub = rateStore.subscribe(instrument, (r) => {
      // 1️⃣ always keep latest tick
      rateBufferRef.current[r.instrument] = r;

      const now = Date.now();
      // console.log('instrument :', instrument , 'time :',now)
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
        const allTicks =Object.values(rateBufferRef.current)
        return allTicks
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

  useEffect(() => {
    bankRateSource.forEach((s) => {
      const sourceKey = s.value;
      const spotInst = bankObj[sourceKey]?.spot;
      const exchInst = bankObj[sourceKey]?.exchange;
      const inrInst = bankObj[sourceKey]?.inr;

      if (spotInst) subscribeInstrument(spotInst);
      if (exchInst) subscribeInstrument(exchInst);
      if (inrInst) subscribeInstrument(inrInst);
    });

    return () => {
      Object.values(subscriptionsRef.current).forEach(unsub => unsub());
      subscriptionsRef.current = {};
    };
  }, [bankObj, bankRateSource]);

  //for dropdown tick
  // useEffect(() => {
  //   bankRateSource.forEach((s) => {
  //     const sourceKey = s.value;
  //     const inrKey = bankObj[sourceKey]?.inr;
  //     // const inrInstrument = inrJSON[inrKey];

  //     // unsubscribe old INR instruments
  //     Object.keys(inrJSON).forEach((k) => {
  //       const inst = inrJSON[k];
  //       if (inst !== inrKey) {
  //         unsubscribeInstrument(inst);
  //       }
  //     });

  //     // subscribe selected INR
  //     subscribeInstrument(inrKey);
  //   });
  // }, [bankObj, bankRateSource]);

  const getBankRate = async () => {
    setIsLoading(true);
    try {
      const response = await getSymbolBankRatedetail();

      if (!response?.success || !response?.data) return;

      const apiData = response.data;

      setBankObj((prev) => {
        const updated = { ...prev };

        // 1️⃣ Map API data by source
        apiData.forEach((item) => {
          const metalDefaults = getDefaultBySource(item.source);

          updated[item.source] = {
            ...BANK_RATE_DEFAULT_VALUES,
            ...Object.fromEntries(
              Object.entries(item).map(([k, v]) => [k, v?.toString?.() ?? v]),
            ),
            spot:
              (
                (goldSources.includes(item.source) && goldSpots.includes(item.spot)) ||
                (silverSources.includes(item.source) && silverSpots.includes(item.spot))
              )
                ? item.spot
                : metalDefaults.spot,
            exchange: (
              (goldSources.includes(item.source) && goldExchange.includes(item.exchange)) ||
              (silverSources.includes(item.source) && silverExchange.includes(item.exchange))
            )
              ? item.exchange
              : metalDefaults.exchange
          };
        });

        // 2️⃣ Ensure all sources exist (fallback to BANK_RATE_DEFAULT_VALUES)
        bankRateSource.forEach((s) => {
          if (!updated[s.value]) {
            const defaults = getDefaultBySource(s.value);
            updated[s.value] = {
              ...BANK_RATE_DEFAULT_VALUES,
              ...defaults
            };
          }
        });
        return updated;
      });
    } catch (error) {
      console.error("error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBankRate();
  }, []);

  // 🔹 Initialize default values per source
  useEffect(() => {
    if (!bankRateSource.length) return;
    setBankObj((prev) => {
      const updated = { ...prev };
      bankRateSource.forEach((s) => {
        if (!updated[s.value]) {
          const defaults = getDefaultBySource(s.value);
          updated[s.value] = {
            ...BANK_RATE_DEFAULT_VALUES,
            ...defaults
          };
        }
      });

      return updated;
    });
  }, [bankRateSource]);

  const handleChange = (e, sourceKey) => {
    const { name, value } = e.target;
    // allow only numbers + one decimal + optional minus
    if (!NON_NUMERIC_FIELDS.includes(name)) {
      if (value !== "" && !/^-?\d*\.?\d*$/.test(value)) return;
    }
    setBankObj((prev) => ({
      ...prev,
      [sourceKey]: {
        ...prev[sourceKey],
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (sourceKey) => {
    if (disabledButton[sourceKey]) return;
    if (!isBankObjValid(bankObj[sourceKey])) {
      toastFn(
        "error",
        "All fields are required. Division and multiply must be greater than 0."
      );
      return;
    }

    setDisabledButton((prev) => ({ ...prev, [sourceKey]: true }));

    const payload = {
      source: sourceKey,
      ...bankObj[sourceKey],
    };
    try {
      const response = await saveOrEditSymbolBankRate(payload);
      if (response?.success && response?.data) {
        toastFn("success", "Symbol bank calculation updated");
      } else {
        toastFn("error", "Failed to update bank calculation!");
      }
    } catch (error) {
      console.error("error:", error);
    } finally {
      setDisabledButton((prev) => ({ ...prev, [sourceKey]: false }));
    }
  };


  const {
    spotAskMap,
    computedRows
  } = useBankRateCalculations({
    bankRateSource,
    bankObj,
    rate
  });

  const differenceData = useMemo(() => {
    return bankRateSource.map(s => {
      const row = computedRows[s.value] || {};
      return {
        key: s.value,
        name: s.name,
        exchange: bankObj[s.value]?.exchange,
        mcxRate: row.mcxRate || 0,
        bankRate: row.finalTotal || 0
      };
    });
  }, [bankRateSource, bankObj, computedRows]);

  //loading
  if (isLoading) {
    return (
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 pl-2 pt-4">
        <Skeleton height={"250px"} />
      </div>
    );
  }

  return (
    <div>
      <LiverateSocket />

      <BankCard>
        <BankCardHeader>
          <BankTitle>Bank Rate</BankTitle>
        </BankCardHeader>

        {bankRateSource?.length > 0 ? (
          <>
            <BankTableWrapper>
              <StyledTable>
                <Tbody>
                  {/* Spot header row */}
                  <BankRateSpotHeader
                    bankRateSource={bankRateSource}
                    bankObj={bankObj}
                    spotAskMap={spotAskMap}
                    onChange={handleChange}
                  />

                  {/* Data rows */}
                  {bankRateRows.map((rowDef) => (
                    <Tr key={rowDef.id}>
                      <LabelTd $align="left">
                        <strong>{rowDef.label}</strong>
                      </LabelTd>

                      {bankRateSource.map((m) => {
                        const sourceKey = m.value;
                        return (
                          <BankRateRow
                            key={`${m.name}_${rowDef.id}`}
                            sourceKey={sourceKey}
                            rowDef={rowDef}
                            value={bankObj[sourceKey]?.[rowDef.name]}
                            inrValue={computedRows[sourceKey]?.inrRate?.toFixed(2)}
                            baseTotal={computedRows[sourceKey]?.baseTotal}
                            finalTotal={computedRows[sourceKey]?.finalTotal}
                            onChange={handleChange}
                            onSubmit={handleSubmit}
                            disabled={disabledButton[sourceKey]}
                          />
                        );
                      })}
                    </Tr>
                  ))}
                </Tbody>

              </StyledTable>
              </BankTableWrapper>
            <DiffWrapper>
              <BankRateDifference
                data={differenceData}
                onChange={handleChange}
                />
            </DiffWrapper>
          </>
        ) : (
          <EmptyStateWrapper>
            No source configured for Bank Rate.
          </EmptyStateWrapper>
        )}
      </BankCard>
    </div>
  );
});

export default BankRate;

