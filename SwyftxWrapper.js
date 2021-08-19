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


  async function axiosRequest(method, url, headers={}, data={}, demo=false, retryCounter=3) {
    const builtUrl = demo ? `${demoUrl}${url}` : `${defaultUrl}${url}`;
    let response = null;
    try {
      response = await axios({method, url: builtUrl, headers, data})
                        .then(resp => resp.data)
                        .catch(err => {
                          if (!err.response) {
                            return {
                              error: "Axios Error/Swyftx Contact Error", 
                              message: "Couldn't reach endpoint. If this is persistent contact the package maintainers." 
                                      + " It is likely this endpoint has changed"
                            };
                          }
                          return err.response.data.error;
                        });  
      if (self.autoWaitOnRateLimit && response.error == 'RateLimit') {
        await sleep(5000);
        return await axiosRequest(method, url, headers, data, demo);
      }
    } catch (err) {
      if (retryCounter > 0) {
        return await axiosRequest(method, url, headers, data, demo, --retryCounter);
      }
      response = {
        error: "EXCEPTION OCCURRED",
        message: `An error occured, ${err}`
      };
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
    const response = await axios.post('https://api.swyftx.com.au/auth/refresh/', {apiKey: self.key})
                      .catch(err => {
                        console.log("Refresh token couldn't be generated. Please contact package maintainers if you see this");
                        return(err);
                      });
    if (response.isAxiosError) return false;
    const accessToken = response.data.accessToken;
    self.accessToken = accessToken;
    return accessToken;
  }

  self.logout = async () => {
    return await axiosRequest("POST", "/auth/logout", this.getHeaders(true));
  }

  self.getScope = async () => {
    return await axiosRequest("GET", "/user/apiKeys/scope", this.getHeaders(true));
  }

  self.getKeys = async () => {
    return await axiosRequest("GET", "/user/apiKeys", this.getHeaders(true));
  }

  self.revokeKey = async (data) => {
    return await axiosRequest("POST", "/user/apiKeys/revoke", this.getHeaders(true), data);
  }

  self.revokeAllKeys = async () => {
    return await axiosRequest("POST", "/user/apiKeys/revokeAll", this.getHeaders(true));
  }

  //Account endpoints

  self.getProfile = async () => {
    return await axiosRequest("GET", "/user", this.getHeaders(true));
  }

  self.setAccountSettings = async (data) => {
    return await axiosRequest("POST", "/user/settings", this.getHeaders(true), data);
  }

  self.getVerificationInfo = async () => {
    return await axiosRequest("GET", "/user/verification", this.getHeaders(true));
  }

  self.getGreenIdVerification = async (data) => {
    return await axiosRequest("GET", "/user/verification/storeGreenId/", this.getHeaders(true), data);
  }

  self.startEmailVerification = async () => {
    return await axiosRequest("POST", "/user/verification/email", this.getHeaders(true));
  }

  self.checkEmailVerificationStatus = async () => {
    return await axiosRequest("GET", "/user/verification/email", this.getHeaders(true));
  }

  self.checkPhoneVerificationStatus = async (token) => {
    return await axiosRequest("GET", `/user/verification/phone/${token}`, this.getHeaders(true));
  }

  self.startPhoneVerification = async (token) => {
    return await axiosRequest("POST", `/user/verification/phone/${token}`, this.getHeaders(true));
  }

  self.getAffiliationInfo = async () => {
    return await axiosRequest("GET", "/user/affiliations", this.getHeaders(true));
  }

  self.getAccountBalances = async () => {
    return await axiosRequest("GET", "/user/balance", this.getHeaders(true), {}, self.demo);
  }

  self.setCurrency = async (data) => {
    return await axiosRequest("POST", "/user/currency", this.getHeaders(true), data);
  }

  self.getStatistics = async () => {
    return await axiosRequest("GET", "/user/statistics", this.getHeaders(true));
  }

  self.getProgress = async () => {
    return await axiosRequest("GET", "/user/progress", this.getHeaders(true));
  }

  self.getPromotions = async () => {
    return await axiosRequest("GET", "/user/promotions", this.getHeaders(true));
  }

  self.getTaxReport = async (start, end) => {
    return await axiosRequest("GET", `/user/taxReport/?from=${start}&to=${end}`, this.getHeaders(true));
  }

  //Charts endpoints

  self.getBarChart = async (base, secondary, side, paginationOptions) => {
    const pagination = paginationHandler(paginationOptions);
    const url = `/charts/getBars/${base}/${secondary}/${side}/${pagination}`;
    return await axiosRequest("GET", url, this.getHeaders(false));
  }

  self.getLatestBar = async (base, secondary, side, resolution) => {
    const pagination = paginationHandler({resolution});
    const url = `/charts/getLatestBar/${base}/${secondary}/${side}/${pagination}`;
    return await axiosRequest("GET", url, this.getHeaders(false));
  }

  self.getChartSettings = async () => {
    return await axiosRequest("GET", "/charts/settings", this.getHeaders(false));
  }

  self.getResolveSymbol = async (base, secondary) => {
    return await axiosRequest("GET", `/charts/resolveSymbol/${base}/${secondary}`, this.getHeaders(false));
  }

  //Funds endpoints

  self.requestWithdrawal = async (assetCode, data) => {
    return await axiosRequest("POST", `/funds/withdraw/${assetCode}`, this.getHeaders(true), data);
  }

  self.checkWithdrawalPermissions = async (assetCode) => {
    return await axiosRequest("GET", `/funds/withdrawalPermissions/${assetCode}`, this.getHeaders(true))
  }

  //History endpoints

  self.getCurrencyWithdrawHistory = async (asset, options) => {
    const url = `/history/withdraw/${asset}/${paginationHandler(options)}`;
    return await axiosRequest("GET", url, this.getHeaders(true), {}, self.demo);
  }

  self.getCurrencyDepositHistory = async (asset, options) => {
    const url = `/history/deposit/${asset}/${paginationHandler(options)}`;
    return await axiosRequest("GET", url, this.getHeaders(true), {}, self.demo);
  }

  self.getAllCurrencyWithdrawHistory = async (options) => {
    const url = `/history/withdraw/${paginationHandler(options)}`;
    return await axiosRequest("GET", url, this.getHeaders(true), {}, self.demo);
  }

  self.getAllCurrencyDepositHistory = async (options) => {
    const url = `/history/deposit/${paginationHandler(options)}`;
    return await axiosRequest("GET", url, this.getHeaders(true), {}, self.demo);
  }

  self.getAllTransactionHistory = async (paginationOptions) => {
    const url = `/history/all/${paginationHandler(paginationOptions)}`;
    return await axiosRequest("GET", url, this.getHeaders(true), {}, self.demo);
  }

  self.getAffiliatePayoutHistory = async (options) => {
    const url = `/history/affiliate/${paginationHandler(options)}`;
    return await axiosRequest("GET", url, this.getHeaders(true));
  }


  //Limits endpoints

  self.getWithdrawalLimits = async() => {
    return await axiosRequest("GET", "/limits/withdrawal", this.getHeaders(true));
  }

  //Market endpoints

  //Default to USD, but can set asset 
  self.getLiveRates = async (primaryAsset="36") => {
    return await axiosRequest("GET", `/live-rates/${primaryAsset}`, this.getHeaders(false));
  }

  self.getMarketAssets = async () => {
    return await axiosRequest("GET", "/markets/assets", this.getHeaders(true));
  }

  self.getBasicInfo = async (asset) => {
    const url = asset ? asset : "";
    return await axiosRequest("GET", `/markets/info/basic/${url}`, this.getHeaders(true));
  }
  
  self.getDetailedInfo = async (asset) => {
    const url = asset ? asset : "";
    return await axiosRequest("GET", `/markets/info/detail/${url}`, this.getHeaders(true));
  }

  //Alert endpoints

  self.getPriceAlerts = async (paginationOptions) => {
    const pagination = paginationHandler(paginationOptions);
    return await axiosRequest("GET", `/alerts${pagination}`, this.getHeaders(true));
  }

  self.createPriceAlert = async (primary, secondary, price) => {
    return await axiosRequest("POST", `/alerts/${primary}/${secondary}`, this.getHeaders(true), {price});
  }

  self.cancelPriceAlert = async (Uuid) => {
    return await axiosRequest("DELETE", `/alerts`, this.getHeaders(true), {priceAlertUuid: Uuid});
  }

  //Orders endpoints

  self.getPairExchangeRate = async (data) => {
    return await axiosRequest("POST", "/orders/rate", this.getHeaders(true), data);
  }

  self.placeOrder = async (data) => {
    return await axiosRequest("POST", "/orders", this.getHeaders(true), data, self.demo);
  }

  self.dustOrder = async (data) => {
    return await axiosRequest("POST", "/user/balance/dust", this.getHeaders(true), data, self.demo);
  }

  self.cancelOrder = async (orderUuid) => {
    return await axiosRequest("DELETE", `/orders/${orderUuid}`, this.getHeaders(true), {}, self.demo);
  }

  self.listOrders = async (assetCode) => {
    const url = assetCode ? `/orders/${assetCode}` : '/orders';
    return await axiosRequest("GET", url, this.getHeaders(true), {}, self.demo);
  }

  self.getOrderByUuid = async (orderUuid) => {
    return await axiosRequest("GET", `/orders/byId/${orderUuid}`, this.getHeaders(true), {}, self.demo);
  }


  //Recurring Orders

  self.getRecurringOrders = async () => {
    return await axiosRequest("GET", "/templates/getUserTemplates", this.getHeaders(true));
  }

  self.getRecurringOrderStats = async (templateUuid) => {
    return await axiosRequest("GET", `/templates/getUserTemplateStats/?templateUuid=${templateUuid}`, this.getHeaders(true));
  }

  self.createRecurringOrder = async (data) => {
    return await axiosRequest("POST", `/templates/createUserTemplate`, this.getHeaders(true), data);
  }

  self.deleteRecurringOrder = async (templateUuid) => {
    return await axiosRequest("DELETE", `/templates/${templateUuid}`, this.getHeaders(true));
  }

  //Swap endpoints

  self.executeSwap = async (data) => {
    return await axiosRequest("POST", "/swap", this.getHeaders(true), data, self.demo)
  }

  //Compare endpoints

  self.compareExchange = async (exchange) => {
    return await axiosRequest("GET", `/compare/${exchange}`, this.getHeaders(true));
  }

  //Message endpoints

  self.getLatestMessages = async (limit=25) => {
    return await axiosRequest("GET", `/messages/latest/${limit}`, this.getHeaders(true));
  }

  self.getLatestAnnouncements = async (limit=25) => {
    return await axiosRequest("GET", `/messages/announcements/${limit}`, this.getHeaders(true));
  }

  //Info endpoints

  self.getApiInfo = async () => {
    return await axiosRequest("GET", "/info", this.getHeaders(true))
  }

  //Portfolio endpoints

  self.getTradePriceHistory = async (assetId) => {
    return await axiosRequest("GET", `/portfolio/tradePriceHistory/${assetId}`, this.getHeaders(true));
  }

  self.getAssetActivity = async (assetId, paginationOptions) => {
    const pagination = paginationHandler(paginationOptions);
    const url = `/portfolio/assetHistory/${assetId}/${pagination}`;
    return await axiosRequest("GET", url, this.getHeaders(true));
  }

  //Place order helpers

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
