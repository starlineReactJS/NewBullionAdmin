import { del, get, post } from "./Api";
import { AUTH_API, BANK_API, UPDATE_API,CONTACT_API, FEEDBACK_API, OTRLIST_API, MASTER_CUSTOM_API, KYC_API, SYMBOL_API, SYMBOL_BANK_RATE_API, COIN_BANK_RATE_API, COIN_API, CATEGORY_API, PRODUCT_API, COSTING_API, CITY_API, CITY_SYMBOL_API } from "./apiEndpoints";

//LOGIN APIS
export const loginAPI = (data) => post(AUTH_API.LOGIN, data);
export const changePasswordAPI = (data) => post(AUTH_API.CHANGE_PASSWORD, data);

//SYMBOL APIS
export const getSymboldetail = (data) => get(SYMBOL_API.GET, data);
export const saveOrEditSymbol =(data) => post(SYMBOL_API.SAVE, data);
export const deleteSymbol = (data) => del(SYMBOL_API.DELETE, data);

//SYMBOL BANK RATE APIS
export const getSymbolBankRatedetail = (data) => get(SYMBOL_BANK_RATE_API.GET, data);
export const saveOrEditSymbolBankRate =(data) => post(SYMBOL_BANK_RATE_API.SAVE, data);

//COIN APIS
export const getCoindetail = (data) => get(COIN_API.GET, data);
export const saveOrEditCoin = (data,baseURL,type) => post(COIN_API.SAVE, data,baseURL,type);
export const deleteCoin = (data) => del(COIN_API.DELETE, data);

//COIN BANK RATE APIS
export const getCoinBankRatedetail = (data) => get(COIN_BANK_RATE_API.GET, data);
export const saveOrEditCoinBankRate =(data) => post(COIN_BANK_RATE_API.SAVE, data);

//UPDATE APIS
export const getUpdateDetails = (data) => get(UPDATE_API.GET, data);
export const saveUpdateDetail = (data) => post(UPDATE_API.SAVE, data);
export const deleteUpdateDetail = (data) => del(UPDATE_API.DELETE, data);

//BANK APIS
export const getBankDetails = (data) => get(BANK_API.GET, data);
export const saveUpdateBankDetail = (data) => post(BANK_API.SAVE, data);
export const deleteBankDetail = (data) => del(BANK_API.DELETE, data);

//CONTACT APIS
export const getContactDetails  = (data) => get(CONTACT_API.GET, data);
export const saveContactDetails = (data) => post(CONTACT_API.SAVE, data);
export const saveBannerDetails = (data,baseURL,type) => post(CONTACT_API.SAVE_BANNER, data,baseURL,type);

//FEEDBACK APIS
export const getFeedbackDetails = (data) => get(FEEDBACK_API.GET, data);
export const deleteFeedbackDetail= (data) => del(FEEDBACK_API.DELETE, data);

//OTRLIST APIS
export const getOTRListDetails = (data) => get(OTRLIST_API.GET, data); 
export const deleteOTRListDetail = (data) => del(OTRLIST_API.DELETE, data);

//KYC APIS
export const getKycDetails = (data) => get(KYC_API.GET, data);
export const saveUpdateKycDetail = (data) => post(KYC_API.SAVE, data);
export const deleteKycDetail = (data) => del(KYC_API.DELETE, data);

//MASTER APIS CALLED IN SETTING PAGE COIN PAGE AND SYMBOL PAGE
export const getSourceDetail = (data) => get(MASTER_CUSTOM_API.GET,data)
export const updateCustomDetail = (data) => post(MASTER_CUSTOM_API.SAVE,data)

//CATEGORY APIS
export const getCategoryDetail = (data) => get(CATEGORY_API.GET,data)
export const saveUpdateCategoryDetail = (data,baseURL,type) => post(CATEGORY_API.SAVE, data,baseURL,type);
export const deleteCategoryDetail = (data) => del(CATEGORY_API.DELETE,data)

//PRODUCT APIS
export const getProductDetail = (data) => get(PRODUCT_API.GET,data)
export const saveUpdateProductDetail = (data,baseURL,type) => post(PRODUCT_API.SAVE, data,baseURL,type);
export const deleteProductDetail = (data) => del(PRODUCT_API.DELETE,data)

//COSTING APIS
export const getCostingBankdetail = (data) => get(COSTING_API.GET, data);
export const saveOrEditCostingRate =(data) => post(COSTING_API.SAVE, data);

//CITY APIS
export const getCityDetails = (data) => get(CITY_API.GET, data);
export const saveUpdateCityDetail = (data) => post(CITY_API.SAVE, data);
export const deleteCityDetail = (data) => del(CITY_API.DELETE, data);

//CITY SYMBOL APIS
export const getCitySymbols = (data) => get(CITY_SYMBOL_API.GET_SYMBOL, data);
export const saveUpdateCitySymbol = (data) => post(CITY_SYMBOL_API.SAVE_SYMBOL, data);

