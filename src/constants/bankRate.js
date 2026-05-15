export const insJSON = {
  'gold999':"GOLDSPOT_I",
  'gold995':"GOLDSPOT_I",
  'silver':"SILVERSPOT_I"
};

export const inFJSON = {
  'gold999': "GOLD_I",
  'gold995': "GOLD_I",
  'silver': "SILVER_I"
}

export const inrJSON = {
  '0':"INRSPOT_I",
  '1':"DGINR_I",
  '2':"DGINR_II",
  '3':"DGINRSPOT_I"
};

export const bankRateRows = [
  { label: "Premium", name: "premium", type: "input",id:'premium' },
  { label: "Inr", name: "inr", type: "select" ,id:'inr', options: [
    { label: "INRSpot", value: "INRSPOT_I" },
    { label: "DGINR", value: "DGINR_I" },
    { label: "DGINRNext", value: "DGINR_II" },
    { label: "DGINRSpot", value: "DGINRSPOT_I" }
  ]},
  { label: "Interbank", name: "interBank", type: "input" ,id:'interBank'},
  { label: "Conversion", name: "conversion", type: "input" ,id:'conversion'},
  { label: "Customduty", name: "customDuty", type: "input",id:'customDuty' },
  { label: "Margin", name: "margin", type: "input",id:'margin' },
  { label: "GST", name: "gst", type: "input",id:'gst' },
  { label: "TDS", name: "tds", type: "input" ,id:'tds'},
  { label: "TCS", name: "tcs", type: "input",id:'tcs' },
  { label: "Total", name: "total", type: "div" ,id :'total'},
  { label: "Division", name: "division", type: "input" ,id:'division'},
  { label: "Multiply", name: "multiply", type: "input",id:'multiply' },
  { label: "", name: "", type: "div",id:'div' },
  { label: "", name: "", type: "button",id:'btn' }
];

export const BANK_RATE_DEFAULT_VALUES = {
  premium: "0",
  inr: "INRSPOT_I",
  interBank: "0",
  conversion: "1",
  customDuty: "0",
  margin: "0",
  gst: "0",
  tds: "0",
  tcs: "0",
  division: "1",
  multiply: "1",
  spot:'GOLDSPOT_I',
  exchange :'GOLD_I'
};


export const SPOT_OPTIONS = {
  GOLD: [
    { label: "GOLDSPOT_I", value: "GOLDSPOT_I" },
    { label: "GOLDCOMEX_I", value: "GOLDCOMEX_I" },
  ],
  SILVER: [
    { label: "SILVERSPOT_I", value: "SILVERSPOT_I" },
    { label: "SILVERCOMEX_I", value: "SILVERCOMEX_I" },
  ],
};

export const EXCHANGE_OPTIONS = {
  GOLD: [
    { label: "GOLD_I", value: "GOLD_I" },
    { label: "GOLD_II", value: "GOLD_II" },
  ],
  SILVER: [
    { label: "SILVER_I", value: "SILVER_I" },
    { label: "SILVER_II", value: "SILVER_II" },
  ],
};

export const calculateBaseTotal = ({
  askRate,
  inrRate,
  premium = 0,
  interBank = 0,
  conversion = 1,
  customDuty = 0,
  margin = 0,
  gst = 0,
  tds = 0,
  tcs = 0
}) => {
  if (!askRate || !inrRate) return 0;

  let total = ((Number(askRate) + Number(premium)) * (Number(inrRate) + Number(interBank)))
  total = total * Number(conversion);
  total += Number(customDuty) + Number(margin);
   total += total * Number(gst) / 100;
  total -= total * Number(tds) / 100;
  total += total * Number(tcs) / 100;

  return total;
};

export const calculateFinalTotal = ({
  baseTotal,
  multiply = 1,
  division = 1
}) => {
  if (!baseTotal) return "0.00";
  return ((baseTotal * multiply) / division).toFixed(2);
};

export const getMetalType = (value = "") => {
  const v = value.toUpperCase();
  if (v.includes("GOLD")) return "GOLD";
  if (v.includes("SILVER")) return "SILVER";
  return "GOLD"; // safe default
};

export const NON_NUMERIC_FIELDS = ["spot", "exchange", "inr"];

export const getDefaultBySource = (source) => {
  if (source === "gold995" || source === "gold999" || source === 'gold') {
    return {
      spot: "GOLDSPOT_I",
      exchange: "GOLD_I"
    };
  }

  if (source === "silver") {
    return {
      spot: "SILVERSPOT_I",
      exchange: "SILVER_I"
    };
  }

  // fallback
  return {
    spot: "",
    exchange: ""
  };
};