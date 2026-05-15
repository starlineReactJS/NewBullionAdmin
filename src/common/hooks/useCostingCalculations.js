import { useMemo } from "react";
import { calculateBaseTotal, calculateFinalTotal } from "../../constants/bankRate";

export const useCostingCalculations = (bankObj, rate) => {
    return useMemo(() => {
        const rateMap = {};
        rate.forEach((r) => {
            rateMap[r.instrument] = r;
        });

        const computedRows = {};

        bankObj.forEach((row) => {
            const id = row.id;

            const spotAsk = Number(rateMap[row.spot]?.ask || 0);
            const inrRate = Number(rateMap[row.inr]?.ask || 0);
            const mcxRate = Number(rateMap[row.exchange]?.ask || 0);

            if (!spotAsk || !inrRate) {
                computedRows[id] = {
                    spotAsk,
                    inrRate,
                    mcxRate,
                    baseTotal: 0,
                    finalTotal: 0,
                };
                return;
            }

            // let total =
            //     (spotAsk +
            //         (+row.premium || 0) +
            //         (+row.interBank || 0)) *
            //     inrRate *
            //     (+row.conversion || 1);

            // total += (+row.customDuty || 0) + (+row.margin || 0);
            // total *= 1 + (+row.gst || 0) / 100;
            // total *= 1 + (+row.tds || 0) / 100;
            // total *= 1 + (+row.tcs || 0) / 100;

            // const division = +row.division || 1;
            // const multiply = +row.multiply || 1;
            const baseTotal = calculateBaseTotal({
                askRate:spotAsk,
                inrRate,
                premium: row.premium,
                interBank: row.interBank,
                conversion: row.conversion,
                customDuty: row.customDuty,
                margin: row.margin,
                gst: row.gst,
                tds: row.tds,
                tcs: row.tcs
            });

            const finalTotal = calculateFinalTotal({
                baseTotal,
                multiply: row.multiply,
                division: row.division
            })

            computedRows[id] = {
                spotAsk,
                inrRate,
                mcxRate,
                baseTotal,
                finalTotal
            };
        });

        return { computedRows };
    }, [bankObj, rate]);
};