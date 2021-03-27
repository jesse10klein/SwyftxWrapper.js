const axios = require("axios");

async function axiosRequest(method, url, data) {
  const response = await axios({method, url, data})
                    .then(resp => resp.data)
                    .catch(err => err.response.data.error);
  return response;
}

function Swyftx(apiKey) {
  const self = this;
  self.key = apiKey;
  self.accessToken = null;

  self.getAccessToken = () => self.accessToken;

  self.generateRefreshToken = async () => {
    const response = await axiosRequest("POST", "https://api.swyftx.com.au/auth/refresh/", {apiKey: self.key});
    console.log(response);
    const accessToken = response.accessToken;
    self.accessToken = accessToken;
    return accessToken;
  }
  
  self.getBasicInfo = async (coin) => {
    const response = await axiosRequest("GET", `https://api.swyftx.com.au/markets/info/basic/${coin}/`, {
      Authorization: `:Bearer ${self.accessToken}`
    })
    return response;
  }


}

module.exports = Swyftx;
