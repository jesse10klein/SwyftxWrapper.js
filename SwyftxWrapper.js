const axios = require("axios");

const baseUrl = "https://api.swyftx.com.au";

async function axiosRequest(method, url, data) {
  const fullUrl = `${baseUrl}${url}`;
  const response = await axios({method, fullUrl, data})
                    .then(resp => resp.data)
                    .catch(err => err.response.data.error);
  return response;
}

function Swyftx(apiKey) {
  const self = this;
  self.key = apiKey;
  self.accessToken = null;

  self.getAccessToken = () => self.accessToken;

  self.setDefaultHeaders = (headers) => {
    headers["Content-Type"] = "Application/json";
    headers["Authorization"] = `Bearer ${self.accessToken}`;
    return headers;
  }

  self.generateRefreshToken = async () => {
    const response = await axiosRequest("POST", "/auth/refresh/", {apiKey: self.key});
    const accessToken = response.accessToken;
    self.accessToken = accessToken;
    return accessToken;
  }
  
  self.getBasicInfo = async (coin) => {
    const response = await axiosRequest("GET", `markets/info/basic/${coin}/`, this.setDefaultHeaders({}));
    return response;
  }

  self.logout = async () => {
    const response = await axiosRequest("POST", "/auth/logout", this.setDefaultHeaders({}));
    return response;
  }

  self.getScope = async () => {
    const response = await axiosRequest("GET", "/user/apiKeys/scope/", this.setDefaultHeaders({}));
    return response;
  }

  self.getKeys = async () => {
    const response = await axiosRequest("GET", "/user/apiKeys", this.setDefaultHeaders({}));
    return response;
  }

  self.revokeKey = async (keyId) => {
    const headers = this.setDefaultHeaders(keyId);
    const reponse = await aciosRequest("POST", "/user/apiKeys/revoke", headers);
  }

  self.revokeAllKeys = async () => {
    const reponse = await aciosRequest("POST", "/user/apiKeys/revokeAll", this.setDefaultHeaders({}));
  }

}

module.exports = Swyftx;
