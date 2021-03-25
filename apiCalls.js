const axios = require("axios");

const apiKey = require('./keys').apiKey;
console.log(apiKey);

async function axiosRequest(method, url, data) {
  const response = await axios({method, url, data})
                    .then(resp => resp.data)
                    .catch(err => err.response.data.error);
  return response;
}

async function getRefreshToken() {
  const response = await axiosRequest("POST", "https://api.swyftx.com.au/auth/refresh/", {apiKey});
  const accessToken = response.accessToken;
  return accessToken;
}

async function getBasicInfo(coin) {
  const response = await axiosRequest("GET", `https://api.swyftx.com.au/markets/info/basic/${coin}/`, {
    Authorization: `:Bearer ${accessToken}`
  })
  return response;
}

const main = async () => {
  
  //const coinInfo = await getBasicInfo("STMX");
  console.log(coinInfo);

}

main();
