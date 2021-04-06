# swyftxwrapper.js

swyftxwrapper.js is a JavaScript wrapper for the Australian Cryptocurrency trading platform Swyftx's API.

* [Installation](#installation)
* [Examples](#example-usage)
* [Supported Endpoints](#endpoints-supported)

## Note

Please be aware, this package is still in development and does not currently support all endpoints, but it aims to in the near future. 

Please scroll towards the bottom of this page to find a list of all of the currently supported endpoints.

If you're having trouble with some of the parameters for specific functions, you can refer to the [Swyftx API docs](https://docs.swyftx.com.au/). There is also a [Method Reference](https://github.com/jesse10klein/SwyftxWrapper.js/blob/main/MethodReference.md) page that has an ordering guide. All methods will be added to the reference soon.

Since the Swyftx API is still in beta, it is subject to change at any time and the documentation may not always be up to date. Due to this, some of the endpoints in this wrapper may break from time to time, but I aim to fix any breaking changes as quickly as I can. If you notice an issue, feel free to raise it on [Github](https://github.com/jesse10klein/SwyftxWrapper.js)

![stonks](https://media.giphy.com/media/XDAY1NNG2VvobAp9o0/giphy.gif)

## Installation

```bash
npm install swyftxwrapper.js
```

## Usage

To use the package, simply require it and instantiate with your API key. Make sure to generate an access token before making any calls.

In depth endpoint guide - [Method Reference](https://github.com/jesse10klein/SwyftxWrapper.js/blob/main/MethodReference.md)

```javascript
const Swyftx = require("swyftxwrapper.js");

const swyftx = new Swyftx("YOUR_API_KEY");

const main = async () => {
  await swyftx.generateRefreshToken();

  //Make any calls to the API you'd like... for example
  const liteCoinData = await swyftx.getBasicInfo("LTC");
  console.log(liteCoinData);
}

main();
```

For **DEMO** use, simply set demo to true when instantiating the wrapper

```javascript

const swyftx = Swyftx("YOUR_API_KEY", demo=true);

```

## Example Usage

Assuming wrapper has been instantiated as *swyftx*

For a comprehensive ordering guide, please click [here](https://github.com/jesse10klein/SwyftxWrapper.js/blob/main/MethodReference.md)

### Change Profile Settings

```javascript
const newProfileSettings = {
  "data": {
    "favouriteAsset": {
      "assetId": 3,
      "favStatus": true
    },
    "analyticsOptOut": true,
    "toggleSMSRecovery": true
  }
}

const response = await swyftx.setAccountSettings(newProfileSettings);
console.log(response);
```

### Place a Market Buy Order

```javascript
//NOTE that the default buy/sell currency is USD.

//Below is equivalent to 'buy $500 USD worth of Doge coin at the market price'
const response = await swyftx.instantBuy("DOGE", 500);

//To specify the amount in terms of the coin being bought and not fiat, set fiat=false
//Below is equivalent to 'buy 500 Doge coin at the market price'
const reponse = await swyftx.instantBuy("DOGE", 500, fiat=false);

```

### Get Comparative CoinSpot Prices

```javascript
const response = await swyftx.compareExchange("coinspot");
console.log(response);
```

### Get Latest Messages From Inbox
```javascript
const response = await swyftx.getLatestMessages(limit=100);
console.log(response);
```

### Get Detailed Info About a Specific Coin
```javascript
const response = await swyftx.getDetailedInfo("LTC");
console.log(response);
```


## Endpoints Supported

### Authentication
* Refresh Access Token &#x2705;
* Logout &#x2705;
* Get Scope &#x2705;
* Get Keys &#x2705;
* Revoke Key &#x2705;
* Revoke All Keys &#x2705;

### Addresses

None of the Addresses endpoints are supported in the current version, though this may change in the future.

### Account

* Get Profile &#x2705;
* Account Settings &#x2705;
* Get Verification Info &#x2705;
* Get GreenId Verification Info &#10060;
* Start Email Verification &#x2705;
* Check Email Verification Status &#x2705;
* Check Phone Verification Status
* Start Phone Verification &#x2705;
* Get Affiliation Info &#x2705;
* Get Account Balances &#x2705;
* Set Currency &#x2705;
* Get Statistics &#x2705;
* Get Progress &#x2705;
* Get Promotions &#x2705;
* Get Tax Report &#x2705;

### Charts

* Get Bar Chart &#x2705;
* Get Latest Bars &#x2705;
* Get Chart Settings &#x2705;
* Get Resolve Symbol &#x2705;

### Charts v2

Not included in the wrapper as this part of the API is deprecated.

### Funds

* Request Withdrawal &#x2705;
* Check Withdrawal Permissions &#x2705;

### History

* Get Currency Withdraw History &#x2705;
* Get Currency Deposit History &#x2705;
* Get All Withdraw History &#x2705;
* Get All Deposit History &#x2705;
* Get History &#x2705;
* Get Affiliate Payout History &#x2705;

### Limits

* Withdrawal Limits &#x2705;

### Markets

* Get Live Rates &#x2705;
* Get Market Assets &#x2705;
* Get Basic Info &#x2705;
* Get Detailed Info &#x2705;

### Orders

* Get Pair Exchange Rate &#x2705;
* Place Order &#x2705;
* Dust Order &#x2705;
* Cancel Order &#x2705;
* Get Orders &#x2705;

### Recurring Orders

* Get Recurring Orders &#x2705;
* Get Recurring Order Stats &#x2705;
* Create Recurring Order &#x2705;
* Delete Recurring Order &#x2705;

### Compare

* Get Comparison &#x2705;

### Messages

* Get Latest Messages &#x2705;
* Get Latest Announcements &#x2705;


