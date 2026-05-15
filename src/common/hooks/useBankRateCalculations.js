import { useMemo } from "react";
import { calculateBaseTotal, calculateFinalTotal } from "../../constants/bankRate";


export const useBankRateCalculations = ({
    bankRateSource,
    bankObj,
    rate
}) => {
    // 1️ instrument → tick map
    const rateMap = useMemo(() => {
        const map = {};
        rate.forEach(r => {
            map[r.instrument] = r;
        });
        return map;
    }, [rate]);

    // 2️ spot ask per source (for header)
    const spotAskMap = useMemo(() => {
        const result = {};
        bankRateSource.forEach(s => {
            const spot = bankObj[s.value]?.spot;
            result[s.value] = rateMap[spot]?.ask?.toFixed(2) ?? "--";
        });
        return result;
    }, [bankRateSource, bankObj, rateMap]);

    // 3️ full computed rows
    const computedRows = useMemo(() => {
        const result = {};

        bankRateSource.forEach(s => {
            const row = bankObj[s.value];
            if (!row) return;

            const askRate = Number(rateMap[row.spot]?.ask || 0);
            const inrRate = Number(rateMap[row.inr]?.ask || 0);
            const mcxRate = Number(rateMap[row.exchange]?.ask || 0);

            const baseTotal = calculateBaseTotal({
                askRate,
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
            });

            result[s.value] = {
                askRate,
                inrRate,
                mcxRate,
                baseTotal,
                finalTotal
            };
        });

        return result;
    }, [bankRateSource, bankObj, rateMap]);

    return {
        rateMap,
        spotAskMap,
        computedRows
    };
};