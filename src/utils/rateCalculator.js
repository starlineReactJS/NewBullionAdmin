export function calculateMainProduct(product, instrumentRate, side) {
    if (!instrumentRate) return null;

    // contract = "INSTRUMENT|B" or "INSTRUMENT|A"
    // const { side } = parseInstrumentAndSide(product?.con);

    let feedBid, feedAsk;

    if (side === "B") {
        feedBid = feedAsk = instrumentRate.bid;
    } else if (side === "A") {
        feedBid = feedAsk = instrumentRate.ask;
    } else {
        feedBid = instrumentRate.bid;
        feedAsk = instrumentRate.ask;
    }

    let buy = null;
    let sell = null;

    if (product.bp !== "--") {
        buy = calculateExchange({
            feed: feedBid,
            premium: product.bp,
            commonPremium: product.bcp,
            division: product.div,
            multiply: product.mul,
            gst: product.gst,
            digit: product.dgt,
            tds: product.tds,
            tcs: product.tcs
        });
    }

    if (product.sp !== "--") {
        sell = calculateExchange({
            feed: feedAsk,
            premium: product.sp,
            commonPremium: product.scp,
            division: product.div,
            multiply: product.mul,
            gst: product.gst,
            digit: product.dgt,
            tds: product.tds,
            tcs: product.tcs
        });
    }


    return {
        ...product,
        buy,
        sell,
        time: instrumentRate.time
    };
};

export function getBank(product, bankConfig, spotRate, inr) {

    if (!bankConfig || !spotRate) return product;

    let bid = null;
    let ask = null;

    const intAsk = spotRate.ask;
    const inrAsk = inr?.ask || 0;
    if (product.bp !== "--") {
        bid = calculateBank(
            intAsk,
            inrAsk,
            bankConfig,
            product.bp,
            product?.isc ? product?.bcp : 0,
            product?.dgt,
            product.gst,
            product?.tds,
            product?.tcs
            // product.div,
            // product.mul,
        );
    }

    if (product.sp !== "--") {
        ask = calculateBank(
            intAsk,
            inrAsk,
            bankConfig,
            product.sp,
            product?.isc ? product?.scp : 0,
            product.dgt,
            product?.dgt,
            product?.tds,
            product?.tcs
            // product.div,
            // product.mul,
        );
    }

    return {
        ...product,
        buy: bid,
        sell: ask,
        high: spotRate.high,
        low: spotRate.low,
        time: spotRate.time
    };
}

export function calculateExchange({
    feed,
    premium,
    commonPremium,
    division,
    multiply,
    gst,
    digit,
    tds,
    tcs
}) {
    let rate =
        Number(feed) +
        Number(premium) +
        Number(commonPremium);

    rate = (rate / Number(division)) * Number(multiply);
    rate += (rate * Number(gst)) / 100;
    rate -= (rate * Number(tds)) / 100;
    rate += (rate * Number(tcs)) / 100;

    return Number(rate.toFixed(digit));
}

function calculateBank(
    intAsk,
    inrAsk,
    bank,
    productPremium,
    productCommonPremium,
    digit,
    // productDivision,
    // productMultiply,
    productGst,
    productTcs,
    productTds
) {
    const premium = bank.prm || 0;
    const interBank = bank.ib || 0;
    const conversion = bank.con || 1;
    const customDuty = bank.cd || 0;
    const margin = bank.mrg || 0;
    const gst = bank.gst || 0;
    const tds = bank.tds || 0;
    const tcs = bank.tcs || 0;
    const multiply = bank.mul || 1;
    const division = bank.div || 1;
    if (!intAsk || !inrAsk) return 0;

    let total = ((Number(intAsk) + Number(premium)) * (Number(inrAsk) + Number(interBank)))
    total = total * Number(conversion);
    total += Number(customDuty) + Number(margin);
    total += total * Number(gst) / 100;
    total -= total * Number(tds) / 100;
    total += total * Number(tcs) / 100;
    const finalTotal = (total * multiply) / division;

    // Add product premiums
    let result = finalTotal + Number(productPremium) + Number(productCommonPremium);
    // Product Taxes
    if (productGst) {
        result += result * Number(productGst) / 100;
    }

    if (productTds) {
        result -= result * Number(productTds) / 100;
    }

    if (productTcs) {
        result += result * Number(productTcs) / 100;
    }

    return Number(finalTotal).toFixed(digit);
}

export const getFix = (product, rate) => {
    if (!product || !rate) return;
    const intAsk = rate.ask;
    const bid = Number(product.bp) + Number(product?.isc ? product.bcp : 0);
    const ask = Number(product.sp) + Number(product?.isc ? product.scp : 0);
    return {
        ...product,
        buy: bid,
        sell: ask,
        high: intAsk.high,
        low: intAsk.low,
    };
};

export const addProductsPremium = (child, parent) => {
    let buy = Number(child.buy);   // keep actual rate
    let sell = Number(child.sell);

    // Step 1: Add Parent Premium + CP
    buy += Number(parent.bp) + Number(parent?.isc ? parent.bcp : 0);
    sell += Number(parent.sp) + Number(parent?.isc ? parent.scp : 0);

    // Step 2: Apply Taxes (GST → TDS → TCS)
    buy += (buy * Number(parent.gst)) / 100;
    buy -= (buy * Number(parent.tds)) / 100;
    buy += (buy * Number(parent.tcs)) / 100;

    sell += (sell * Number(parent.gst)) / 100;
    sell -= (sell * Number(parent.tds)) / 100;
    sell += (sell * Number(parent.tcs)) / 100;

    // Step 3: Apply MULTIPLY / DIVISION
    buy = (buy * Number(parent.mul)) / Number(parent.div);
    sell = (sell * Number(parent.mul)) / Number(parent.div);

    return {
        ...child,
        buy,
        sell
    };
};