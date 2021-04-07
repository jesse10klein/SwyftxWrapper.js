const axios = require("axios");

const defaultUrl = "https://api.swyftx.com.au";
const demoUrl = "https://api.demo.swyftx.com.au";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function paginationHandler(options) {
  let optionsPresent = [];
  for (option in options) {
    optionsPresent.push(`${option}=${options[option]}`);
  }
  const optionsString = optionsPresent.join("&");
  if (optionsPresent.length == 0) return "";
  return "?" + optionsString;
}

function Swyftx(apiKey, demoMode=false, autoWaitOnRateLimit=false) {

  const self = this;
  self.demo = demoMode;
  self.key = apiKey;
  self.accessToken = null;
  self.autoWaitOnRateLimit = autoWaitOnRateLimit;


  async function axiosRequest(method, url, headers={}, data={}, demo=false) {
    const builtUrl = demo ? `${demoUrl}${url}` : `${defaultUrl}${url}`;
    const response = await axios(
                      {   
                        method, 
                        url: builtUrl, 
                        headers, 
                        data
                      })
                      .then(resp => resp.data)
                      .catch(err => err.response.data.error);
    if (self.autoWaitOnRateLimit && response.error == 'RateLimit') {
      await sleep(5000);
      return axiosRequest(method, url, headers, data, demo);
    }
    return response;
  }



  self.getAccessToken = () => self.accessToken;

  self.getHeaders = (needsAuth) => {
    headers = {"Content-Type": "application/json"};
    if (needsAuth) headers["Authorization"] = `Bearer ${self.accessToken}`;
    return headers;
  }

  self.setDemoMode = (demoMode) => self.demo = demoMode;

  //Authentication endpoints

  self.generateRefreshToken = async () => {
    const response = await axios.post('https://api.swyftx.com.au/auth/refresh/', {apiKey: self.key});
    const accessToken = response.data.accessToken;
    self.accessToken = accessToken;
    return accessToken;
  }

  //WORKING
  self.logout = async () => {
    return await axiosRequest("POST", "/auth/logout", this.getHeaders(true));
  }

  //WORKING
  self.getScope = async () => {
    return await axiosRequest("GET", "/user/apiKeys/scope", this.getHeaders(true));
  }

  //WORKING
  self.getKeys = async () => {
    return await axiosRequest("GET", "/user/apiKeys", this.getHeaders(true));
  }

  //WORKING
  self.revokeKey = async (data) => {
    return await axiosRequest("POST", "/user/apiKeys/revoke", this.getHeaders(true), data);
  }

  //WORKING
  self.revokeAllKeys = async () => {
    return await axiosRequest("POST", "/user/apiKeys/revokeAll", this.getHeaders(true));
  }

  //Account endpoints

  //WORKING
  self.getProfile = async () => {
    return await axiosRequest("GET", "/user", this.getHeaders(true));
  }

  //WORKING
  self.setAccountSettings = async (data) => {
    return await axiosRequest("POST", "/user/settings", this.getHeaders(true), data);
  }

  //WORKING
  self.getVerificationInfo = async () => {
    return await axiosRequest("GET", "/user/verification", this.getHeaders(true));
  }

  //NOT WORKING
  self.getGreenIdVerification = async (data) => {
    return await axiosRequest("GET", "/user/verification/storeGreenId/", this.getHeaders(true), data);
  }

  //WORKING
  self.startEmailVerification = async () => {
    return await axiosRequest("POST", "/user/verification/email", this.getHeaders(true));
  }

  //WORKING
  self.checkEmailVerificationStatus = async () => {
    return await axiosRequest("GET", "/user/verification/email", this.getHeaders(true));
  }

  //NOT WORKING
  self.checkPhoneVerificationStatus = async (token) => {
    return await axiosRequest("GET", `/user/verification/phone/${token}`, this.getHeaders(true));
  }

  //WORKING
  self.startPhoneVerification = async (token) => {
    return await axiosRequest("POST", `/user/verification/phone/${token}`, this.getHeaders(true));
  }

  //WORKING
  self.getAffiliationInfo = async () => {
    return await axiosRequest("GET", "/user/affiliations", this.getHeaders(true));
  }

  //WORKING
  self.getAccountBalances = async () => {
    return await axiosRequest("GET", "/user/balance", this.getHeaders(true), {}, demo=self.demo);
  }

  //WORKING
  self.setCurrency = async (data) => {
    return await axiosRequest("POST", "/user/currency", this.getHeaders(true), data);
  }

  //WORKING
  self.getStatistics = async () => {
    return await axiosRequest("GET", "/user/statistics", this.getHeaders(true));
  }

  //WORKING
  self.getProgress = async () => {
    return await axiosRequest("GET", "/user/progress", this.getHeaders(true));
  }

  //WORKING
  self.getPromotions = async () => {
    return await axiosRequest("GET", "/user/promotions", this.getHeaders(true));
  }

  //NOT WORKING
  self.getTaxReport = async (start, end) => {
    return await axiosRequest("GET", `/user/taxReport/?from=${start}&to=${end}`, this.getHeaders(true));
  }

  //Charts endpoints

  //WORKING
  self.getBarChart = async (base, secondary, side, paginationOptions) => {
    const pagination = paginationHandler(paginationOptions);
    const url = `/charts/getBars/${base}/${secondary}/${side}/${pagination}`;
    return await axiosRequest("GET", url, this.getHeaders(false));
  }

  //NOT WORKING
  self.getLatestBar = async (base, secondary, side, resolution) => {
    const pagination = paginationHandler({resolution});
    const url = `/charts/getLatestBar/${base}/${secondary}/${side}/${pagination}`;
    return await axiosRequest("GET", url, this.getHeaders(false));
  }

  //WORKING
  self.getChartSettings = async () => {
    return await axiosRequest("GET", "/charts/settings", this.getHeaders(false));
  }

  //WORKING
  self.getResolveSymbol = async (base, secondary) => {
    return await axiosRequest("GET", `/charts/resolveSymbol/${base}/${secondary}`, this.getHeaders(false));
  }

  //Funds endpoints

  //WORKING
  self.requestWithdrawal = async (assetCode, data) => {
    return await axiosRequest("POST", `/funds/withdraw/${assetCode}`, this.getHeaders(true), data);
  }

  //WORKING
  self.checkWithdrawalPermissions = async (assetCode) => {
    return await axiosRequest("GET", `/funds/withdrawalPermissions/${assetCode}`, this.getHeaders(true))
  }

  //History endpoints

  //WORKING
  self.getCurrencyWithdrawHistory = async (asset, options) => {
    const url = `/history/withdraw/${asset}/${paginationHandler(options)}`;
    return await axiosRequest("GET", url, this.getHeaders(true), {}, demo=self.demo);
  }

  //WORKING
  self.getCurrencyDepositHistory = async (asset, options) => {
    const url = `/history/deposit/${asset}/${paginationHandler(options)}`;
    return await axiosRequest("GET", url, this.getHeaders(true), {}, demo=self.demo);
  }

  //WORKING
  self.getAllCurrencyWithdrawHistory = async (options) => {
    const url = `/history/withdraw/${paginationHandler(options)}`;
    return await axiosRequest("GET", url, this.getHeaders(true), {}, demo=self.demo);
  }

  //WORKING
  self.getAllCurrencyDepositHistory = async (options) => {
    const url = `/history/deposit/${paginationHandler(options)}`;
    return await axiosRequest("GET", url, this.getHeaders(true), {}, demo=self.demo);
  }

  //WORKING
  self.getAllTransactionHistory = async (paginationOptions) => {
    const url = `/history/all/${paginationHandler(paginationOptions)}`;
    return await axiosRequest("GET", url, this.getHeaders(true), {}, demo=self.demo);
  }

  //WORKING
  self.getAffiliatePayoutHistory = async (options) => {
    const url = `/history/affiliate/${paginationHandler(options)}`;
    return await axiosRequest("GET", url, this.getHeaders(true));
  }


  //Limits endpoints

  //WORKING
  self.getWithdrawalLimits = async() => {
    return await axiosRequest("GET", "/limits/withdrawal", this.getHeaders(true));
  }

  //Market endpoints

  //Default to USD, but can set asset 
  self.getLiveRates = async (primaryAsset="36") => {
    return await axiosRequest("GET", `/live-rates/${primaryAsset}`, this.getHeaders(false));
  }

  //WORKING
  self.getMarketAssets = async () => {
    return await axiosRequest("GET", "/markets/assets", this.getHeaders(false));
  }
  //WORKING
  self.getBasicInfo = async (asset) => {
    return await axiosRequest("GET", `/markets/info/basic/${asset}/`, this.getHeaders(false));
  }
  
  //WORKING
  self.getDetailedInfo = async (asset) => {
    return await axiosRequest("GET", `/markets/info/detail/${asset}`, this.getHeaders(false));
  }

  //Orders endpoints

  //WORKING
  self.getPairExchangeRate = async (data) => {
    return await axiosRequest("POST", "/orders/rate", this.getHeaders(true), data);
  }

  //NOT WORKING
  self.placeOrder = async (data) => {
    return await axiosRequest("POST", "/orders", this.getHeaders(true), data, demo=self.demo);
  }

  //WORKING
  self.dustOrder = async (data) => {
    return await axiosRequest("POST", "/user/balance/dust", this.getHeaders(true), data, demo=self.demo);
  }

  //WORKING
  self.cancelOrder = async (orderUuid) => {
    return await axiosRequest("DELETE", `/orders/${orderUuid}`, this.getHeaders(true), {}, demo=self.demo);
  }

  //WORKING
  self.listOrders = async (assetCode) => {
    const url = assetCode ? '/orders/${assetCode}' : '/orders';
    return await axiosRequest("GET", url, this.getHeaders(true), {}, demo=self.demo);
  }

  //Recurring Orders

  //WORKING
  self.getRecurringOrders = async () => {
    return await axiosRequest("GET", "/templates/getUserTemplates", this.getHeaders(true));
  }

  //WORKING
  self.getRecurringOrderStats = async (templateUuid) => {
    return await axiosRequest("GET", `/templates/getUserTemplateStats/?templateUuid=${templateUuid}`, this.getHeaders(true));
  }

  //NOT WORKING
  self.createRecurringOrder = async (data) => {
    return await axiosRequest("POST", `/templates/createUserTemplate`, this.getHeaders(true), data);
  }

  //WORKING
  self.deleteRecurringOrder = async (templateUuid) => {
    return await axiosRequest("DELETE", `/templates/${templateUuid}`, this.getHeaders(true));
  }

  //Compare endpoints

  //WORKING
  self.compareExchange = async (exchange) => {
    return await axiosRequest("GET", `/compare/${exchange}`, this.getHeaders(true));
  }

  //Message endpoints

  //WORKING
  self.getLatestMessages = async (limit=25) => {
    return await axiosRequest("GET", `/messages/latest/${limit}`, this.getHeaders(true));
  }

  //WORKING
  self.getLatestAnnouncements = async (limit=25) => {
    return await axiosRequest("GET", `/messages/announcements/${limit}`, this.getHeaders(true));
  }

  self.getApiInfo = async () => {
    return await axiosRequest("GET", "/info", this.getHeaders(true))
  }


  //WORKING
  self.instantBuy = async (secondary, quantity, fiat=true, primary="USD") => {
    const data = {
      "primary": primary,
      "secondary": secondary,
      "quantity": quantity,
      "assetQuantity": fiat ? primary : secondary,
      "orderType": "MARKET_BUY"
    }
    return await self.placeOrder(data);
  }

  //WORKING
  self.instantSell = async (secondary, quantity, fiat=true, primary="USD") => {
    const data = {
      "primary": primary,
      "secondary": secondary,
      "quantity": quantity,
      "assetQuantity": fiat ? primary : secondary,
      "orderType": "MARKET_SELL"
    }
    return await self.placeOrder(data);
  }

  //WORKING
  self.placeLimitBuyOrder = async (secondary, quantity, trigger, fiat=true, primary="USD") => {
    const data = {
      primary,
      secondary,
      quantity,
      "assetQuantity": fiat ? primary : secondary,
      "orderType": "LIMIT_BUY",
      trigger
    }
    return await self.placeOrder(data);
  }

  //WORKING
  self.placeLimitSellOrder = async (secondary, quantity, trigger, fiat=true, primary="USD") => {
    const data = {
      primary,
      secondary,
      quantity,
      "assetQuantity": fiat ? primary : secondary,
      "orderType": "LIMIT_SELL",
      trigger: 1/trigger
    }
    return await self.placeOrder(data);
  }

  //WORKING
  self.placeStopLimitBuyOrder = async (secondary, quantity, trigger, fiat=true, primary="USD") => {
    const data = {
      primary,
      secondary,
      quantity,
      "assetQuantity": fiat ? primary : secondary,
      "orderType": "STOP_LIMIT_BUY",
      trigger
    }
    return await self.placeOrder(data);
  }

  //WORKING
  self.placeStopLimitSellOrder = async (secondary, quantity, trigger, fiat=true, primary="USD") => {
    const data = {
      primary,
      secondary,
      quantity,
      "assetQuantity": fiat ? primary : secondary,
      "orderType": "LIMIT_SELL",
      trigger: 1/trigger
    }
    return await self.placeOrder(data);
  }

}

module.exports = Swyftx;
