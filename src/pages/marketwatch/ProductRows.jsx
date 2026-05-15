import React, { useEffect, useRef, useState } from "react";
import {
    getBank,
    calculateMainProduct,
    formatTime,
    parseInstrumentAndSide
} from "@/utils";
import { rateStore } from "../../socketStore/rateStore";
import { highLowStore } from "../../socketStore/highLowStore";
import { addProductsPremium, getFix } from "../../utils/rateCalculator";
import { CellText, Td, Tr } from "../../common/styledComponents";


const getHighLow = (range, sellRate, attr) => {
    try {
        const rangeHighLow = range[attr];
        if (rangeHighLow && sellRate) {
            if (attr == 'high') {
                return Math.max(sellRate, rangeHighLow);
            } else {
                return Math.min(sellRate, rangeHighLow);
            }
        }
        return null;
    } catch (error) {
        console.log('getHighLow error :', error);
    }
};

const ProductRows = React.memo(({ product, bank, instrument, side ,productMap,bankRateInfo}) => {
    const isRefProduct = product?.rt === "product";
    const parentProduct  =isRefProduct ? productMap?.[product?.pt] : product;
    const { instrument: parentInstrument, side: parentSide } =
        isRefProduct
            ? (
                parentProduct?.rt === "bank"
                    ? { instrument: parentProduct?.src === 'silver' ? 'SILVERSPOT_I' : 'GOLDSPOT_I', side: null }
                    : parseInstrumentAndSide(parentProduct?.con)   
            )
            : { instrument, side }; 

    const [row, setRow] = useState();
    const [range, setRange] = useState({ high: null, low: null });
    const inrRateRef = useRef(null);

    const prevRateRef = useRef(null);
    const lastUpdateRef = useRef(0);

    useEffect(() => {
        if (!bank?.inr) return;

        return rateStore.subscribe(bank.inr, (rate) => {
            inrRateRef.current = rate;
        });
    }, [bank]);

    useEffect(() => {
        if (!parentInstrument) return;
        return rateStore.subscribe(parentInstrument, (rate) => {
            if (throttleData()) {
                // setRow((prev) => {
                //     prevRateRef.current = { ...prev };
                //     return product.rt === "exchange" ? calculateMainProduct(product, rate, side) : getBank(product, bank, rate, inrRateRef.current);
                // });
                setRow((prev) => {
                    prevRateRef.current = { ...prev };
                    let calculated;
                    if (product.rt === "exchange" || isRefProduct) {
                        if (parentProduct?.rt === 'bank') {
                            const parentBank = bankRateInfo[parentProduct?.src];
                            calculated = getBank(parentProduct, parentBank, rate, inrRateRef.current);
                        } else if (parentProduct?.rt === 'fix') {
                            calculated = getFix(parentProduct, rate);
                        }
                        else {
                            calculated = calculateMainProduct(parentProduct, rate, parentSide);
                        }
                        if (isRefProduct) {
                            calculated = addProductsPremium(calculated, product);
                        }
                    }
                    else if (product.rt === "fix") {
                        calculated = getFix(parentProduct, rate);
                    }
                    else {
                        calculated = getBank(parentProduct, bank, rate, inrRateRef.current);
                    }

                    return {
                        ...calculated,
                        nam: product.nam
                    };
                });
            }
        });
    }, [parentInstrument, bank]);

    const throttleData = () => {
        try {
            const now = Date.now();
            if (now - lastUpdateRef.current < 150) return;
            lastUpdateRef.current = now;
            return true;
        } catch (error) {
            console.log('throttleData error :', error);
            return false;
        }
    };

    useEffect(() => {
        const uid = parentProduct?.uid;
        if (!uid) return;

        return highLowStore.subscribe(uid, (data) => {
            setRange(data);
        });
    }, [parentProduct?.uid]);

    if (!row) return null;

    //   const buyBg = backgroundColorClass(row?.buy, prevRateRef.current?.buy);
    //   const sellBg = backgroundColorClass(row?.sell, prevRateRef.current?.sell);
    // const productLow = row?.sell < range?.low ? row?.sell : range?.low;

    // const productHigh = range?.high == null ? row?.sell : Math.max(range?.high, row?.high);
    // const productLow = range?.low == null ? row?.sell : Math.min(row?.low, range?.low);

    const productHigh = getHighLow(range, row?.sell, 'high') || row?.sell;
    const productLow = getHighLow(range, row?.sell, 'low') || row?.sell;

    if (productHigh != null && range?.high == null || productHigh > range?.high) {
        setRange(p => ({ ...p, high: productHigh }));
    }
    if (productLow != null && range?.low == null || productLow < range?.low) {
        setRange(p => ({ ...p, low: productLow }));
    }
    return (
        <Tr>
            <Td>
                <CellText className="content">
                    {row.nam} 
                </CellText>
            </Td>
            <Td>
                <CellText className="content">
                    {row.buy ?? "--"} 
                </CellText>
            </Td>
            <Td>
                <CellText className="content">
                    {row.sell ?? "--"} 
                </CellText>
            </Td>
            <Td>
                <CellText className="content">
                    {productHigh ?? '--'}
                </CellText>
            </Td>
            <Td>
                <CellText className="content">
                    {productLow ?? '--'} 
                </CellText>
            </Td>
            <Td>
                <CellText className="content">{formatTime(row.time)}</CellText>
            </Td>
        </Tr>
    );
});

export default ProductRows;
