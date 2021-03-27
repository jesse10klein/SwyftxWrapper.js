const axios = require("axios");

const baseUrl = "https://api.swyftx.com.au";

async function axiosRequest(method, url, headers) {
  const response = await axios({method, url: `${baseUrl}${url}`, headers})
                    .then(resp => resp.data)
                    .catch(err => {console.log(err); err.response.data.error});
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

  self.generateRefreshToken = async () => {
    const response = await axiosRequest("POST", "/auth/refresh/", {apiKey: self.key});
    const accessToken = response.accessToken;
    self.accessToken = accessToken;
    return accessToken;
  }

  //History endpoints

  self.getCurrencyWithdrawHistory = async (options) => {
    const url = `/history/withdraw/${paginationHandler(options)}`;
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

}

module.exports = Swyftx;
