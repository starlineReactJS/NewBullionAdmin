
export function parseInstrument(data) {
    // const p = data.split("|");

    return {
        // instrument: p[0],
        // bid: Number(p[1]),
        // ask: Number(p[2]),
        // high: Number(p[3]),
        // low: Number(p[4]),
        // time: p[9]
        instrument: data[0],
        bid: Number(data[1]),
        ask: Number(data[2]),
        high: Number(data[3]),
        low: Number(data[4]),
        time: data[9]
    };
}

export function parseInstrumentAndSide(value) {
    const contract = value.split("|");

    return {
        instrument: contract[0],
        side: contract[1],
    };
}

export const formatTime = (ts) => {
    if (!ts) return "--:--:--";

    return new Date(Number(ts)).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });
};

export const flattenPermissions = (obj, result = {}) => {
    Object.entries(obj).forEach(([key, val]) => {
        if (typeof val === "object" && val !== null) {
            flattenPermissions(val, result);
        } else {
            result[key] = Boolean(val);
        }
    });
    return result;
};