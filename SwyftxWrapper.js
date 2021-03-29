const axios = require("axios");

let baseUrl = "https://api.swyftx.com.au";

async function axiosRequest(method, url, headers={}, data={}) {
  console.log(url);
  const response = await axios(
                    {   
                      method, 
                      url: `${baseUrl}${url}`, 
                      headers, 
                      data
                    })
                    .then(resp => resp.data)
                    .catch(err => err.response.data.error);
  return response;
}

function paginationHandler(options) {
  let optionsPresent = [];
  if (options.limit) optionsPresent.push(`limit=${options.limit}`);
  if (options.page) optionsPresent.push(`page=${options.page}`)
  if (options.sortBy) optionsPresent.push(`sortBy=${options.sortBy}`)
  const optionsString = optionsPresent.join("&");
  if (optionsPresent.length == 0) return "";
  return "?" + optionsString;
}

function Swyftx(apiKey, demo=false) {

  if (demo) baseUrl = "https://api.demo.swyftx.com.au";
  const self = this;
  self.key = apiKey;
  self.accessToken = null;

  self.getAccessToken = () => self.accessToken;

  self.getHeaders = (needsAuth) => {
    headers = {"Content-Type": "application/json"};
    if (needsAuth) headers["Authorization"] = `Bearer ${self.accessToken}`;
    return headers;
  }

  //Authentication endpoints

  self.generateRefreshToken = async () => {
    const response = await axios.post(`${baseUrl}/auth/refresh/`, {apiKey: self.key});
    const accessToken = response.data.accessToken;
    self.accessToken = accessToken;
    return accessToken;
  }

  //WORKING
  self.logout = async () => {
    const response = await axiosRequest("POST", "/auth/logout", this.getHeaders(true));
    return response;
  }

  //WORKING
  self.getScope = async () => {
    const response = await axiosRequest("GET", "/user/apiKeys/scope", this.getHeaders(true));
    return response;
  }

  //WORKING
  self.getKeys = async () => {
    const response = await axiosRequest("GET", "/user/apiKeys", this.getHeaders(true));
    return response;
  }

  //WORKING
  self.revokeKey = async (data) => {
    const response = await axiosRequest("POST", "/user/apiKeys/revoke", this.getHeaders(true), data);
    return response;
  }

  //WORKING
  self.revokeAllKeys = async () => {
    const response = await axiosRequest("POST", "/user/apiKeys/revokeAll", this.getHeaders(true));
    return response;
  }

  //Account endpoints

  //WORKING
  self.getProfile = async () => {
    const response = await axiosRequest("GET", "/user", this.getHeaders(true));
    return response;
  }

  //WORKING
  self.setAccountSettings = async (data) => {
    const response = await axiosRequest("POST", "/user/settings", this.getHeaders(true), data);
    return response;
  }

  //WORKING
  self.getVerificationInfo = async () => {
    const response = await axiosRequest("GET", "/user/verification", this.getHeaders(true));
    return response;
  }

  //NOT WORKING
  self.getGreenIdVerification = async (data) => {
    const response = await axiosRequest("GET", "/user/verification/storeGreenId/", this.getHeaders(true), data);
    return response;
  }

  //WORKING
  self.startEmailVerification = async () => {
    const response = await axiosRequest("POST", "/user/verification/email", this.getHeaders(true));
    return response;
  }

  //WORKING
  self.checkEmailVerificationStatus = async () => {
    const response = await axiosRequest("GET", "/user/verification/email", this.getHeaders(true));
    return response;
  }

  //NOT WORKING
  self.checkPhoneVerificationStatus = async (token) => {
    const response = await axiosRequest("GET", `/user/verification/phone/${token}`, this.getHeaders(true));
    return response;
  }

  //WORKING
  self.startPhoneVerification = async (token) => {
    const response = await axiosRequest("POST", `/user/verification/phone/${token}`, this.getHeaders(true));
    return response;
  }

  //WORKING
  self.getAffiliationInfo = async () => {
    const response = await axiosRequest("GET", "/user/affiliations", this.getHeaders(true));
    return response;
  }

  //WORKING
  self.getAccountBalances = async () => {
    const response = await axiosRequest("GET", "/user/balance", this.getHeaders(true));
    return response;
  }

  //WORKING
  self.setCurrency = async (data) => {
    const response = await axiosRequest("POST", "/user/currency", this.getHeaders(true), data);
    return response;
  }

  //WORKING
  self.getStatistics = async () => {
    const response = await axiosRequest("GET", "/user/statistics", this.getHeaders(true));
    return response;
  }

  //WORKING
  self.getProgress = async () => {
    const response = await axiosRequest("GET", "/user/progress", this.getHeaders(true));
    return response;
  }

  //WORKING
  self.getPromotions = async () => {
    const response = await axiosRequest("GET", "/user/promotions", this.getHeaders(true));
    return response;
  }

  //NOT WORKING
  self.getTaxReport = async (start, end) => {
    const response = await axiosRequest("GET", `/user/taxReport/?from=${start}&to=${end}`, this.getHeaders(true));
    return response;
  }

  //Charts endpoints

  //WORKING
  self.getBarChart = async (base, secondary, resolution, side, start, end, limit) => {
    const pagination = `?resolution=${resolution}&timeStart=${start}&timeEnd=${end}&limie=${limit}`;
    const url = `/charts/getBars/${base}/${secondary}/${side}${pagination}`;
    const response = await axiosRequest("GET", url, this.getHeaders(false));
    return response;
  }

  //NOT WORKING
  self.getLatestBar = async (base, secondary, resolution, side) => {
    const pagination = `?resolution=${resolution}`;
    const url = `/charts/getLatestBar/${base}/${secondary}/${side}/${pagination}`;
    const response = await axiosRequest("GET", url, this.getHeaders(false));
    return response;
  }

  //WORKING
  self.getChartSettings = async () => {
    const response = await axiosRequest("GET", "/charts/settings", this.getHeaders(false));
    return response;
  }

  //WORKING
  self.getResolveSymbol = async (base, secondary) => {
    const response = await axiosRequest("GET", `/charts/resolveSymbol/${base}/${secondary}`, this.getHeaders(false));
    return response;
  }

  //Funds endpoints

  //WORKING
  self.requestWithdrawal = async (assetCode, data) => {
    const response = await axiosRequest("POST", `/funds/withdraw/${assetCode}`, this.getHeaders(true), data);
    return response;
  }

  //WORKING
  self.checkWithdrawalPermissions = async (assetCode) => {
    const response = await axiosRequest("GET", `/funds/withdrawalPermissions/${assetCode}`, this.getHeaders(true))
    return response;
  }

  //History endpoints

  //WORKING
  self.getCurrencyDepositHistory = async (asset, options) => {
    const url = `/history/deposit/${asset}/${paginationHandler(options)}`;
    const response = await axiosRequest("GET", url, this.getHeaders(true));
    return response;
  }

  //WORKING
  self.getCurrencyWithdrawHistory = async (coin, options) => {
    const url = `/history/withdraw/${coin}/${paginationHandler(options)}`;
    const response = await axiosRequest("GET", url, this.getHeaders(true));
    return response;
  }

  //WORKING
  self.getCurrencyDepositHistory = async (coin, options) => {
    const url = `/history/deposit/${coin}/${paginationHandler(options)}`;
    const response = await axiosRequest("GET", url, this.getHeaders(true));
    return response;
  }

  //WORKING
  self.getAllCurrencyWithdrawHistory = async (options) => {
    const url = `/history/withdraw/${paginationHandler(options)}`;
    const response = await axiosRequest("GET", url, this.getHeaders(true));
    return response;
  }

  //WORKING
  self.getAllCurrencyDepositHistory = async (options) => {
    const url = `/history/deposit/${paginationHandler(options)}`;
    const response = await axiosRequest("GET", url, this.getHeaders(true));
    return response;
  }


  //NEED TO WORK OUT
  self.getAllTransactionHistory = async () => {
    const url = `/history/all/}`;
    const response = await axiosRequest("GET", url, this.getHeaders(true));
    return response;
  }

  //WORKING
  self.getAffiliatePayoutHistory = async (options) => {
    const url = `/history/affiliate/${paginationHandler(options)}`;
    const response = await axiosRequest("GET", url, this.getHeaders(true));
    return response;
  }


  //Limits endpoints

  //WORKING
  self.getWithdrawalLimits = async() => {
    const response = await axiosRequest("GET", "/limits/withdrawal", this.getHeaders(true));
    return response;
  }

  //Market endpoints

  //WORKING
  self.getLiveRatesAUD = async () => {
    const response = await axiosRequest("GET", "/live-rates/1", this.getHeaders(false));
    return response;
  }

  //WORKING
  self.getMarketAssets = async () => {
    const response = await axiosRequest("GET", "/markets/assets", this.getHeaders(false));
    return response;
  }
  //WORKING
  self.getBasicInfo = async (coin) => {
    const response = await axiosRequest("GET", `/markets/info/basic/${coin}/`, this.getHeaders(false));
    return response;
  }
  
  //WORKING
  self.getDetailedInfo = async (coin) => {
    const response = await axiosRequest("GET", `/markets/info/detail/${coin}`, this.getHeaders(false));
    return response;
  }

  //Orders endpoints

  //WORKING
  self.getPairExchangeRate = async (data) => {
    const response = await axiosRequest("POST", "/orders/rate", this.getHeaders(true), data);
    return response;
  }

  //NOT WORKING
  self.placeOrder = async (data) => {
    const response = await axiosRequest("POST", "/orders", this.getHeaders(true), data);
    return response;
  }

  //WORKING
  self.dustOrder = async (data) => {
    const response = await axiosRequest("POST", "/user/balance/dust", this.getHeaders(true), data);
    return response;
  }

  //CAN'T TEST YET
  self.cancelOrder = async (orderUuid) => {
    const response = await axiosRequest("DELETE", `/orders/${orderUuid}`, this.getHeaders(true));
    return response;
  }

  //WORKING
  self.listOrders = async (assetCode) => {
    const response = await axiosRequest("GET", `/orders/`, this.getHeaders(true));
    return response;
  }

  //Recurring Orders

  //WORKING
  self.getRecurringOrders = async () => {
    const response = await axiosRequest("GET", "/templates/getUserTemplates", this.getHeaders(true));
    return response;
  }

  //WORKING
  self.getRecurringOrderStats = async (templateUuid) => {
    const response = await axiosRequest("GET", `/templates/getUserTemplateStats/?templateUuid=${templateUuid}`, this.getHeaders(true));
    return response;
  }

  //NOT WORKING
  self.createRecurringOrder = async (data) => {
    const response = await axiosRequest("POST", `/templates/createUserTemplate`, this.getHeaders(true), data);
    return response;
  }

  //WORKING
  self.deleteRecurringOrder = async (templateUuid) => {
    const response = await axiosRequest("DELETE", `/templates/${templateUuid}`, this.getHeaders(true));
    return response;
  }

  //Compare endpoints

  //WORKING
  self.compareExchange = async (exchange) => {
    const response = await axiosRequest("GET", `/compare/${exchange}`, this.getHeaders(true));
    return response;
  }

  //Message endpoints

  //WORKING
  self.getLatestMessages = async (limit=10) => {
    const response = await axiosRequest("GET", `/messages/latest/${limit}`, this.getHeaders(true));
    return response;
  }

  //WORKING
  self.getLatestAnnouncements = async (limit=10) => {
    const response = await axiosRequest("GET", `/messages/announcements/${limit}`, this.getHeaders(true));
    return response;
  }

}

module.exports = Swyftx;
