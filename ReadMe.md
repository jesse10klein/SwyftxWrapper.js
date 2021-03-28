# swyftxwrapper.js

swyftxwrapper.js is a JavaScript wrapper for the Australian Cryptocurrency trading platform Swyftx.

## Installation

To install swyftwrapper.js simple use NPM in a terminal

```bash
npm install swyftxwrapper.js
```
## Note

Please be aware, this package is still in development and does not currently support all endpoints.
Please scroll down for a list of endpoints supported and refer to the Swyftx API here https://docs.swyftx.com.au/ for specific details for the endpoints

## Usage

To use the package, simply require it. Make sure to generate an access token before making any calls.

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

For DEMO use, simply set demo to true when instantiating the wrapper

```javascript

const swyftx = Swyftx("YOUR_API_KEY", demo=true);

```

## Example Usage

Assuming wrapper has been instantiated as *swyftx*

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

const response = await swyftx.setAccountSettings(data);
console.log(response);
```

### Get Comparative CoinSpot Prices

```javascript
const response = await swyftx.compareExchange("coinspot");
console.log(response);
```

### Get Messages
```javascript
const response = await swyftx.getLatestMessages(limit=100);
console.log(response);
```

### Get Detailed Info About a Specific Coin
```javascript
const reponse = await swyftx.getDetailedInfo("LTC");
console.log(response);
```

## Endpoints Supported

This wrapper aims to successfully cover all endpoints. Since the Swyftx API is still in beta, it is subject to change at any time and the documentation may not always be up to date.

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
* Get Tax Report &#10060;

### Charts

* Get Bar Chart &#x2705;
* Get Latest Bars &#10060;
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
* Get History &#10060;
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
* Cancel Order &#10060;
* Get Orders &#x2705;

### Recurring Orders

* Get Recurring Orders &#x2705;
* Get Recurring Order Stats &#x2705;
* Create Recurring Order &#10060;
* Delete Recurring Order &#x2705;

### Compare

* Get Comparison &#x2705;

### Messages

* Get Latest Messages &#x2705;
* Get Latest Announcements &#x2705;


