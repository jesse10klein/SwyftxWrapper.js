const axios = require("axios");

const baseUrl = "https://api.swyftx.com.au";

async function axiosRequest(method, url, headers={}, data={}) {
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
  return "?" + optionsString;
}

function Swyftx(apiKey) {
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

  self.logout = async () => {
    const response = await axiosRequest("POST", "/auth/logout", this.getHeaders(true));
    return response;
  }

  self.getScope = async () => {
    const response = await axiosRequest("GET", "/user/apiKeys/scope", this.getHeaders(true));
    return response;
  }

  self.getKeys = async () => {
    const response = await axiosRequest("GET", "/user/apiKeys", this.getHeaders(true));
    return response;
  }

  self.revokeKey = async () => {
    const response = await axiosRequest("POST", "/user/apiKeys/revoke", this.getHeaders(true));
    return response;
  }

  self.revokeAllKeys = async () => {
    const response = await axiosRequest("POST", "/user/apiKeys/revokeAll", this.getHeaders(true));
    return response;
  }

  //Addresses endpoints

  self.getActiveAddresses = async (coin, variantId) => {
    const response = await axiosRequest("GET", `${coin}/${variantId}?version=2`, this.getHeaders(true));
    return response;
  }

  self.createNewAddress = async (coin, variantId) => {
    const response = await axiosRequest("POST", `/address/deposit/${coin}/${variantId}`, this.getHeaders(true));
    return response;
  }

  self.getSavedAddresses = async (assetCode) => {
    const response = await axiosRequest("GET", `/address/withdraw/${assetCode}`, this.getHeaders(true));
    return response;
  }

  self.saveNewAddress = async (assetCode) => {
    const response = await axiosRequest("POST", `/address/withdraw/${assetCode}`, this.getHeaders(true));
    return response;
  }

  self.removeAddress = async (addressId) => {
    const response = await axiosRequest("DELETE", `/address/withdraw/${addressId}`, this.getHeaders(true));
    return response;
  }

  self.verifyWithdrawalAddress = async (token) => {
    const response = await axiosRequest("GET", `/address/withdraw/verify/${token}`, this.getHeaders(true));
    return response;
  }

  self.verifyBSB = async (bsb) => {
    const response = await axiosRequest("GET", `/address/withdraw/bsb-verify/${bsb}`, this.getHeaders(true));
    return response;
  }

  self.checkForDeposit = async (code, addressId) => {
    const response = await axiosRequest("GET", `/address/check/${code}/${addressId}`, this.getHeaders(true));
    return response;
  }

  //Account

  self.getProfile = async () => {
    const response = await axiosRequest("GET", "/user", this.getHeaders(true));
    return response;
  }

  self.accountSettings = async (data) => {
    const response = await axiosRequest("POST", "/user/settings", this.getHeaders(true), data);
    return response;
  }

  self.getVerificationInfo = async () => {
    const response = await axiosRequest("GET", "/user/verification", this.getHeaders(true));
    return response;
  }

  self.getGreenIdVerification = async () => {
    const response = await axiosRequest("GET", "/user/verification/storeGreenId", this.getHeaders(true));
    return response;
  }

  self.startEmailVerification = async () => {
    const response = await axiosRequest("POST", "/user/verification/email", this.getHeaders(true));
    return response;
  }

  self.checkEmailVerificationStatus = async () => {
    const response = await axiosRequest("GET", "/user/verification/email", this.getHeaders(true));
    return response;
  }

  self.checkPhoneVerificationStatus = async (token) => {
    const response = await axiosRequest("GET", `/user/verification/phone/${token}`, this.getHeaders(true));
    return response;
  }

  self.startPhoneVerification = async (token) => {
    const response = await axiosRequest("POST", `/user/verification/phone/${token}`, this.getHeaders(true));
    return response;
  }

  self.getAffiliationInfo = async () => {
    const response = await axiosRequest("GET", "/user/affiliations", this.getHeaders(true));
    return response;
  }

  self.getAccountBalances = async () => {
    const response = await axiosRequest("GET", "/user/balance", this.getHeaders(true));
    return response;
  }

  self.getStatistics = async () => {
    const response = await axiosRequest("GET", "/user/statistics", this.getHeaders(true));
    return response;
  }

  self.getProgress = async () => {
    const response = await axiosRequest("GET", "/user/progress", this.getHeaders(true));
    return response;
  }

  self.getPromotions = async () => {
    const response = await axiosRequest("GET", "/user/promotions", this.getHeaders(true));
    return response;
  }

  self.getTaxReport = async (start, end) => {
    const response = await axiosRequest("GET", `/user/taxReports/?from${start}&to=${end}`, this.getHeaders(true));
    return response;
  }

  //Charts endpoints

  self.getBarChart = async (base, secondary, resolution, side, start, end, limit) => {
    const pagination = `?resolution=${resolution}&timeStart=${start}&timeEnd=${end}&limie=${limit}`;
    const url = `/charts/getBars/${base}/${secondary}/${side}${pagination}`;
    const response = await axiosRequest("GET", url, this.getHeaders(false));
    return response;
  }

  self.getLatestBars = async (base, secondary, resolution, side) => {
    const pagination = `?resolution=${resolution}`;
    const url = `/charts/getLatestsBar/${base}/${secondary}/${side}${pagination}`;
    const response = await axiosRequest("GET", url, this.getHeaders(false));
    return response;
  }

  self.getChartSettings = async () => {
    const response = await axiosRequest("GET", "/charts/settings", this.getHeaders(false));
    return response;
  }

  self.getResolveSymbol = async (base, secondary) => {
    const response = await axiosRequest("GET", `/charts/resolveSymbol/${base}/${secondary}`, this.getHeaders(false));
    return response;
  }

  //Funds endpoints

  self.requestWithdrawal = async (assetCode, data) => {
    const response = await axiosRequest("POST", `/funds/withdraw/${assetCode}`, this.getHeaders(true), data);
    return response;
  }

  self.checkWithdrawalPermissions = async (assetCode) => {
    const response = await axiosRequest("GET", `/funds/withdrawalPermissions/${assetCode}`, this.getHeaders(true))
    return response;
  }

  //History endpoints

  self.getCurrencyDepositHistory = async (asset, options) => {
    const url = `/history/deposit/${asset}/${paginationHandler(options)}`;
    const response = await axiosRequest("GET", url, this.getHeaders(true));
    return response;
  }

  self.getCurrencyWithdrawHistory = async (options) => {
    const url = `/history/withdraw/${paginationHandler(options)}`;
    const response = await axiosRequest("GET", url, this.getHeaders(true));
    return response;
  }

  self.getAllCurrencyDepositHistory = async (options) => {
    const url = `/history/deposit/${paginationHandler(options)}`;
    const response = await axiosRequest("GET", url, this.getHeaders(true));
    return response;
  }

  self.getAllTransactionHistory = async (type, assetId, options) => {
    const url = `/history/all/${type}/${assetId}/${paginationHandler(options)}`;
    const response = await axiosRequest("GET", url, this.getHeaders(true));
    return response;
  }

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

  //NEED TO CHECK
  self.getLiveRates = async (coin) => {
    const response = await axiosRequest("GET", `/live-rates/${coin}/`, this.getHeaders(false));
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

  //Orders
  self.getPairExchangeRate = async (data) => {
    const response = await axiosRequest("POST", `/orders/rate`, this.getHeaders(true), data);
    return response;
  }

  self.placeOrder = async (data) => {
    const response = await axiosRequest("POST", `/orders`, this.getHeaders(true), data);
    return response;
  }

  self.dustOrder = async (data) => {
    const response = await axiosRequest("POST", `/user/balance/dust`, this.getHeaders(true), data);
    return response;
  }

  self.cancelOrder = async (orderUuid) => {
    const response = await axiosRequest("DELETE", `/orders/${orderUuid}`, this.getHeaders(true));
    return response;
  }

  self.listOrders = async (assetCode) => {
    const response = await axiosRequest("GET", `/orders/${assetCode}`, this.getHeaders(true));
    return response;
  }

  //Recurring Orders

  self.getRecurringOrders = async () => {
    const response = await axiosRequest("GET", "/templates/getUserTemplates", this.getHeaders(true));
    return response;
  }

  self.getRecurringOrderStats = async (templateUuid) => {
    const response = await axiosRequest("GET", `/templates/getUserTemplateStats/?templateUuid=${templatUuid}`, this.getHeaders(true));
    return response;
  }

  self.createRecurringOrder = async (data) => {
    const response = await axiosRequest("POST", `/templates/createUserTemplate`, this.getHeaders(true), data);
    return response;
  }

  self.deleteRecurringOrder = async (templateUuid) => {
    const response = await axiosRequest("DELETE", `/templates/${templateUuid}`, this.getHeaders(true));
    return response;
  }

  //Compare endpoints

  self.compareExchange = async (exchange) => {
    const response = await axiosRequest("GET", `/compare/${exchange}`, this.getHeaders(true));
    return response;
  }

  //Message endpoints

  self.getLatestMessages = async (limit=10) => {
    const response = await axiosRequest("GET", `/messages/latest/${limit}`, this.getHeaders(true));
    return response;
  }

  self.getLatestAnnouncements = async (limit=10) => {
    const response = await axiosRequest("GET", `/messages/announcements/${limit}`, this.getHeaders(true));
    return response;
  }



}

module.exports = Swyftx;
