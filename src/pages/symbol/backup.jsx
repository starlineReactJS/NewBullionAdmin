import React, { useContext, useMemo, useState, useEffect } from "react";
import { isBankObjValid, toastFn } from '@/utils';
import { getSymbolBankRatedetail, saveOrEditSymbolBankRate } from "../../ApiServices/services";
import Skeleton from "../../common/components/skeleton";
import { bankRateRows, inrJSON, insJSON,BANK_RATE_DEFAULT_VALUES, inFJSON, SPOT_OPTIONS, EXCHANGE_OPTIONS } from "../../constants/bankRate";
import { sourceContext } from "../../layout/AdminBullionLayout";
import { useSelector } from "react-redux";
import { rateStore } from "../../socketStore/rateStore";
import { instrument } from "../../Config";

const BankRate = () => {
  const sourceData = useContext(sourceContext);
  const [bankObj, setBankObj] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [disabledButton, setDisabledButton] = useState({});
  const [rate, setRate] = useState([]);
  const subscriptionsRef = React.useRef({});
  const rateBufferRef = React.useRef({});
  const lastUpdateRef = React.useRef(0);
  const THROTTLE_MS = 150;
  const bankRateSource = useMemo(
    () =>
      sourceData?.source
        ? sourceData.source.filter((item) => item?.isBankRate)
        : [],
    [sourceData],
  );
  const subscribeInstrument = (instrument) => {
    if (!instrument || subscriptionsRef.current[instrument]) return;

    const unsub = rateStore.subscribe(instrument, (r) => {
      // 1️⃣ always keep latest tick
      rateBufferRef.current[r.instrument] = r;

      const now = Date.now();
      if (now - lastUpdateRef.current < THROTTLE_MS) return;

      lastUpdateRef.current = now;

      // 2️⃣ flush buffered ticks
      setRate((prev) => {
        const updated = [...prev];

        Object.values(rateBufferRef.current).forEach((tick) => {
          const i = updated.findIndex((x) => x.instrument === tick.instrument);

          if (i !== -1) {
            updated[i] = tick;
          } else {
            updated.push(tick);
          }
        });

        return updated;
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

  // useEffect(() => {
  //   // bankRateSource.forEach((s) => {
  //   //   const spotInstrument = insJSON[s.value];
  //   //   subscribeInstrument(spotInstrument);
  //   // });
  //   //   bankRateSource.forEach((s) => {
  //   //   const futureInstrument = inFJSON[s.value];
  //   //   subscribeInstrument(futureInstrument);
  //   // });

  //   const instruments = bankRateSource.map(s => insJSON[s.value]).filter(Boolean).concat(
  //     bankRateSource.map(s => inFJSON[s.value]).filter(Boolean)
  //   );

  //   instruments.forEach(inst => subscribeInstrument(inst));

  //   return () => {
  //     Object.values(subscriptionsRef.current).forEach((unsub) => unsub());
  //     subscriptionsRef.current = {};
  //   };
  // }, [bankRateSource]);

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
  useEffect(() => {
    bankRateSource.forEach((s) => {
      const sourceKey = s.value;
      const inrKey = bankObj[sourceKey]?.inr;
      // const inrInstrument = inrJSON[inrKey];

      // unsubscribe old INR instruments
      Object.keys(inrJSON).forEach((k) => {
        const inst = inrJSON[k];
        if (inst !== inrKey) {
          unsubscribeInstrument(inst);
        }
      });

      // subscribe selected INR
      subscribeInstrument(inrKey);
    });
  }, [bankObj, bankRateSource]);

  /* ---------------- Rate Map (NO UI CHANGE) ---------------- */
  const rateMap = useMemo(() => {
    const map = {};
    rate.forEach((r) => {
      map[r.instrument] = r;
    });
    return map;
  }, [rate]);

  const getRow = React.useCallback(
    (sourceKey) => bankObj[sourceKey],
    [bankObj]
  );

  const getSpotAskRate = (row) => {
    if (!row?.spot) return 0;
    return Number(rateMap[row.spot]?.ask || 0);
  };

  /* ---------------- INR Rate (Tick Safe) ---------------- */
  const getInrRate = (row) => {
    if (!row?.inr) return 0;
    return Number(rateMap[row.inr]?.ask || 0);
  };

  const calculateBaseTotal = (row) => {
    const premium = +row.premium || 0;
    const interBank = +row.interBank || 0;
    const conversion = +row.conversion || 1;
    const customDuty = +row.customDuty || 0;
    const margin = +row.margin || 0;
    const gst = +row.gst || 0;
    const tds = +row.tds || 0;
    const tcs = +row.tcs || 0;

    const askRate = getSpotAskRate(row);
    const inrRate = getInrRate(row);

    if (!askRate || !inrRate) return 0;

    let total = (askRate + premium + interBank) * inrRate * conversion;

    total += customDuty + margin;
    total *= 1 + gst / 100;
    total *= 1 + tds / 100;
    total *= 1 + tcs / 100;

    return total;
  };

  const calculateFinalTotal = (row) => {
    const baseTotal = calculateBaseTotal(row);
    if (!baseTotal) return "0.00";

    const division = +row?.division || 1;
    const multiply = +row?.multiply || 1;

    const final = (baseTotal * multiply) / division;

    return final.toFixed(2);
  };

  const getDefaultBySource = (source = "") => {
    const v = source.toUpperCase();

    if (v.includes("SILVER")) {
      return {
        spot: "SILVERSPOT_I",
        exchange: "SILVER_I",
      };
    }

    // GOLD (default)
    return {
      spot: "GOLDSPOT_I",
      exchange: "GOLD_I",
    };
  };

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
              spot: item.spot ?? metalDefaults.spot,
          exchange: item.exchange ?? metalDefaults.exchange
          };
        });

        // 2️⃣ Ensure all sources exist (fallback to BANK_RATE_DEFAULT_VALUES)
        bankRateSource.forEach((s) => {
          if (!updated[s.value]) {
            updated[s.value] = { ...BANK_RATE_DEFAULT_VALUES };
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
          updated[s.value] = { ...BANK_RATE_DEFAULT_VALUES };
        }
      });

      return updated;
    });
  }, [bankRateSource]);
  const NON_NUMERIC_FIELDS = ["spot", "exchange", "inr"];

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
        "All fields are required. Division and Multiply must be greater than 0."
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
        toastFn("success", "Bank Calculation Updated");
      } else {
        toastFn("error", "Failed to Update!");
      }
    } catch (error) {
      console.error("error:", error);
    } finally {
      setDisabledButton((prev) => ({ ...prev, [sourceKey]: false }));
    }
  };

  const getFutureAskRate = (row) => {
    if (!row?.exchange) return 0;
    return Number(rateMap[row.exchange]?.ask || 0);
  };

  const calculateMcxRate = (row) => {
    return getFutureAskRate(row);
  };

  const getMetalType = (value = "") => {
    const v = value.toUpperCase();
    if (v.includes("GOLD")) return "GOLD";
    if (v.includes("SILVER")) return "SILVER";
    return "GOLD"; // safe default
  };

  //loading
  if (isLoading) {
    return (
      <div className="col-lg-4 col-md-12 pl-2 pt-4">
        <Skeleton height={"250px"} />
      </div>
    );
  }

  return (
    <>
      {bankRateSource?.length > 0 ? (
        <div className="col-lg-4 col-md-12 pl-2 pr-2">
          <div className="ex-right-cvr text-center">
            <div className="bnk-rate mt-1">
              <h6 className="py-1 common-bg ">
                <strong>Bank Rate</strong>
              </h6>
              <div className="table-cover">
                <div className="table-wrapper">
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <div className="content">
                            <p className="text-left pl-3">
                              <strong></strong>
                            </p>
                          </div>
                        </td>

                        {bankRateSource.map((m, index) => {
                          const instrument = bankObj[m.value]?.spot;
                          const metal = getMetalType(m.value);
                          const spotOptions = (SPOT_OPTIONS[metal]);
                          const rateObj = rate?.filter(
                            (d) => d.instrument === instrument,
                          );
                          const ask = rateObj?.[0]?.ask.toFixed(2);
                          return (
                            // <td key={index}>
                            //   <div className="content">
                            //     <h6>
                            //       <strong>{m.name}</strong>
                            //       <strong className="mt-1 d-block">
                            //         {ask}
                            //       </strong>
                            //     </h6>
                            //   </div>
                            // </td>
                              <td key={index}>
                                <strong className="text-dark">{m?.name}</strong>
                                <div className="content">
                                    <select
                                      className="sm-font mb-1"
                                  name="spot"
                                  value={bankObj[m.value]?.spot}
                                  onChange={(e) => handleChange(e, m.value)}
                                    >
                                      {spotOptions?.map((o) => (
                                        <option key={o.value} value={o.value}>
                                          {o.label}
                                        </option>
                                      ))}
                                    </select>

                                    <p className="mt-1 d-block text-center text-dark">
                                      {ask}
                                    </p>
                                </div>
                              </td>
                          );
                        })}
                      </tr>

                      {bankRateRows.map((row, rIndex) => (
                        <tr key={rIndex}>
                          <td style={{width:'100px'}}>
                            <div className="content">
                              <p className="text-left pl-3">
                                <strong>{row.label}</strong>
                              </p>
                            </div>
                          </td>

                          {bankRateSource.map((m, index) => {
                            const sourceKey = m.value;

                            return (
                              <td key={index}>
                                <div className="content">
                                  {row.type === "input" ? (
                                    <input
                                      className="sm-font input-height"
                                      name={row.name}
                                      value={
                                        bankObj[sourceKey]?.[row.name] ?? ""
                                      }
                                      onChange={(e) =>
                                        handleChange(e, sourceKey)
                                      }
                                    />
                                  ) : row.type === "select" ? (
                                    <>
                                      <p className="text-center mb-1">
                                        <strong className="spotGold">
                                          {getInrRate(getRow(sourceKey)).toFixed(2)}
                                        </strong>
                                      </p>
                                      <select
                                        className="sm-font mb-1"
                                        name={row.name}
                                        value={bankObj[sourceKey]?.[row.name]}
                                        onChange={(e) =>
                                          handleChange(e, sourceKey)
                                        }
                                      >
                                        <option value="INRSPOT_I">INRSpot</option>
                                        <option value="DGINR_I">DGINR</option>
                                        <option value="DGINR_II">DGINRNext</option>
                                        <option value="DGINRSPOT_I">DGINRSpot</option>
                                      </select>
                                    </>
                                  ) : row.type === "button" ? (
                                    <button
                                      className="btn common-bg my-2"
                                      disabled={disabledButton[sourceKey]}
                                      style={{
                                        background: disabledButton[sourceKey]
                                          ? "#ccc"
                                          : "",
                                        cursor: disabledButton[sourceKey]
                                          ? "not-allowed"
                                          : "pointer",
                                        transition: "none",
                                        padding: "4px 10px",
                                      }}
                                      onClick={() => handleSubmit(sourceKey)}
                                    >
                                      Submit
                                    </button>
                                  ) : row.type === "div" && row.name === 'total' ? (
                                    <h6>
                                      <strong className="sm-font totalGold">
                                       {calculateBaseTotal(getRow(sourceKey)).toFixed(2)}
                                      </strong>
                                    </h6>
                                  ) : (
                                    <h6>
                                      <strong className="sm-font totalGold">
                                       {calculateFinalTotal(getRow(sourceKey))}
                                      </strong>
                                    </h6>
                                  )}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <h6 className="py-1 common-bg my-2">
                    <strong>Difference</strong>
                  </h6>
                  <div className="gs-diffrence">
                    <div className="row m-0">
                      {bankRateSource.map((d, index) => {
                        const metal = getMetalType(d.value);
                        const exchangeOptions =
                          EXCHANGE_OPTIONS[metal];
                          const row = getRow(d.value);
                        return (
                          <div
                            key={`bank_${index}`}
                            className="col p-0"
                            style={{ borderRight: "2px solid #fff" }}
                          >
                            <div className="gs-cvr common-bg">
                              <div>
                                <p className="text-center sm-font common-bg py-1">
                                  {d.name}
                                </p>
                                <select
                                  className="sm-font mb-1"
                                  name="exchange"
                                  value={bankObj[d.value]?.exchange}
                                  onChange={(e) => handleChange(e, d.value)}
                                >
                                  {exchangeOptions.map((o) => (
                                    <option key={o.value} value={o.value}>
                                      {o.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="gs-cvr-r-main">
                                <div className="gs-cvr-r">
                                  <h6 className="mb-1 sm-font">MCX</h6>
                                  <h6 className="mb-1 sm-font mcxGold">{calculateMcxRate(row)}</h6>
                                </div>
                                <div className="gs-cvr-r">
                                  <h6 className="mb-1 sm-font">BANK</h6>
                                  <h6 className="mb-1 sm-font grandTotalGold">
                                    {calculateFinalTotal(row)}
                                  </h6>
                                </div>
                                <p className="w-100 gsrat py-1 diffGold">
                                  {calculateFinalTotal(row) - calculateMcxRate(row)}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="col-lg-4 col-md-12 pl-2 pt-4">
          <div className="ex-right-cvr text-center">
            <div className="bnk-rate mt-1">
              <h6 className="py-1 common-bg">
                <strong>Bank Rate</strong>
              </h6>

              <div className="table-wrapper">
                <table>
                  <tbody>
                    <tr>
                      <td className="smy">Currently no source available</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BankRate;

