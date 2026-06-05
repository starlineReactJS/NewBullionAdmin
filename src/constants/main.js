// Map menu item names to API access keys
export const routePermissionKeyMap = {
    symbol: "symbol",
    coin: "coin",
    update: "update",
    bank: "bank",
    userdetails: "contact",      // API access key for UserDetails
    feedbacklist: "feedback",    // API access key for FeedbackList
    otrlist: "otr",              // API access key for OTRList
    kyc: "kyc",
    marketwatch: "marketwatch",
    setting: "setting",
    calculater: 'calculater',
    costing: 'costing',
    order: 'order',
    account: 'account',
    group: 'group',
    hedge: 'hedge',
    trade: 'trade',
    type:'type',
    category:'category',
    subcategory:'subcat',
    product:'product',
    city:'city'
};

export const contractOptions = [
    { label: "Current Bid Ask", value: "I|BA" },
    { label: "Current Ask", value: "I|A" },
    { label: "Current Bid", value: "I|B" },
    { label: "Future Bid Ask", value: "II|BA" },
    { label: "Future Ask", value: "II|A" },
    { label: "Future Bid", value: "II|B" },
    { label: "Past Bid Ask", value: "III|BA" },
    { label: "Past Ask", value: "III|A" },
    { label: "Past Bid", value: "III|B" },
];

export const bankOptions = [
    { value: "axis", label: "Axis Bank" },
    { value: "bob", label: "Bank Of Baroda" },
    { value: "icici", label: "ICICI Bank" },
    { value: "hdfc", label: "HDFC Bank" },
    { value: "pnb", label: "Punjab National Bank" },
    { value: "dena", label: "Dena Bank" },
    { value: "yes", label: "Yes Bank" },
    { value: "kotak", label: "Kotak Mahindra Bank Ltd" },
    { value: "allahabad", label: "Allahabad Bank" },
    { value: "au", label: "AU Bank" },
    { value: "corporation", label: "Corporation Bank" },
    { value: "indus", label: "Indusind Bank" },
    { value: "rbl", label: "RBL Bank" },
    { value: "cosmos", label: "Cosmos Bank" },
    { value: "union", label: "Union Bank of India" },
    { value: "kaijs", label: "KAIJS Bank" },
    { value: "sbi", label: "State Bank of India" },
];
