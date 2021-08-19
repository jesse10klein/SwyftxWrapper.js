# swyftxwrapper.js Usage Guide

**[Authentication](#authentication-endpoints)**

**[Account](#account-endpoints)**

**[Charts](#charts-endpoints)**

**[Funds](#funds-endpoints)**

**[History](#history-endpoints)**

**[Limits](#limits-endpoints)**

**[Markets](#markets-endpoints)**

**[Orders](#orders-endpoints)**

**[Recurring Orders](#recurring-orders-endpoints)**

**[Compare](#compare-endpoints)**

**[Messages](#messages-endpoints)**

**[Info](#info-endpoints)**

**[Ordering - In Depth](#ordering-in-depth)**

### **Assuming that the Swyftx Wrapper has been instantiates as *swyftx***

### Toggle Demo Mode

```javascript
swyftx.setDemoMode(false);
```

## Authentication Endpoints

### Refresh Access Token

```javascript
const token = await swyftx.generateRefreshToken();
```

### Logout

```javascript
const response = await swyftx.logout();
```
### Get Scope

```javascript
const scope = await swyftx.getScope();
```

### Get Keys

```javascript
const keys = await swyftx.getKeys();
```

### Revoke Key

**keyId**: The Id of the key you wish to revoke

```javascript
const keyId = "YOUR_KEY_ID"
const response = await swyftx.revokeKey(keyId);
```
### Revoke All Keys

```javascript
const response = await swyftx.revokeAllKeys();
```

## Account Endpoints

### Get Profile

```javascript
const profileDetails = await swyftx.getProfile();
```
### Account Settings

**data**: account settings to change

```javascript
const data = {
  data: {
    "favouriteAsset": {
      "assetId": 3,
      "favStatus": true
    },
    "analyticsOptOut": false,
    "toggleSMSRecovery": true
  }
};
const response = await swyftx.setAccountSettings(data);
```
### Get Verification Info

```javascript
const response = await swyftx.getVerificationInfo();
```

### Start Email Verification

```javascript
const response = await swyftx.startEmailVerification();
```
### Check Email Verification Status

```javascript
const response = await swyftx.checkEmailVerificationStatus();
```

### Get Affiliation Info

```javascript
const affiliationInfo = await swyftx.getAffiliationInfo();
```
### Get Account Balances

```javascript
const balances = await swyftx.getAccountBalances();
```
### Set Currency

**data**: An object including the asset you want as your default currency

```javascript
const data = {
  "profile": {
    "defaultAsset": 1
  }
};
const response = await swyftx.setCurrency(data);
```
### Get Statistics

```javascript
const response = await swyftx.getStatistics();
```
### Get Progress

```javascript
const response = await swyftx.getProgress();
```
### Get Promotions

```javascript
const response = await swyftx.getPromotions();
```
### Get Tax Report

**start**: Start Date for tax report in ms

**end**: End date for tax report in ms

```javascript
const start = 1593518400000;
const end = 1593539400000;
const response = await swyftx.getTaxReport(start, end);
```

## Charts Endpoints

### Get Bar Chart

**base**: Primary Asset

**secondary**: Secondary Asset

**side**: 'ask' or 'bid'

**paginationOptions**: Pagination object - contains resolution, timeStart, timeEnd and limit

**resolution**: How long? (1m, 5m, 1h, 4h, 1d)

**start** (optional): Time to start from, in timestamp form

**end** (optional): Time to end search, in timestamp form

**limit** (optional): The maximum number of bars returned

```javascript
const paginationOptions = {
  resolution: "1m",
  timeStart: 1517458855347,
  timeEnd: 1517458865347,
  limit: 50
}
const barChart = await swyftx.getBarChart("USD", "LTC", "ask", paginationOptions);
```

### Get Latest Bars

**base**: Primary Asset

**secondary**: Secondary Asset

**side**: 'ask' or 'bid'

**resolution**: How long? (1m, 5m, 1h, 4h, 1d)

```javascript
const latestbar = await swyftx.getLatestBar("USD", "BTC", "ask", "5m");
```
### Get Chart Settings

```javascript
const chartSettings = await swyftx.getChartSettings();
```
### Get Resolve Symbol

**base**: Primary Asset

**secondary**: Secondary Asset

```javascript
const resolveSymbol = await swyftx.getResolveSymbol("USD", "ADA");
```

## Funds Endpoints

### Request Withdrawal

**asset**: The asset code for the currency you want to withdraw

**data**: Contains quanitity, address_id and reason

**quantity**: The amount of the currency you'd like to withdraw

**address_id**: The id of the address to send the currency to

**reason**: Reason for withdrawal (Enum)

```javascript
const data = {
  "quantity": 1.243,
  "address_id": 3,
  "reason": 1
}
const response = await swyftx.requestWithdrawal("BTC", data);
```

### Check Withdrawal Permissions

**asset**: The asset code for the currency you want to check permissions on

```javascript
const response = await swyftx.checkWithdrawalPermissions("LTC");
```

## History Endpoints

All History Endpoints use Pagination with these parameters

**limit**: Number of entries to return

**page**: Page to start on

**sortBy**: Field and direction to sort on (prefix with +/- to indicate direction)

#### Pagination Object Example

```javascript
const paginationOptions = {
  limit: 50,
  page: 0,
  sortBy: "+quantity"
}
```

### Currency Withdraw History

**asset**: The asset code for the currency you want to withdraw

```javascript
const history = await swyftx.getCurrencyWithdrawHistory("BTC", paginationOptions);
```

### Currency Deposit History

**asset**: The asset code for the currency you want to withdraw

```javascript
const history = await swyftx.getCurrencyDepositHistory("BTC", paginationOptions);
```

### All Withdraw History
```javascript
const history = await swyftx.getAllCurrencyWithdrawHistory(paginationOptions);
```

### All Deposit History

```javascript
const history = await swyftx.getAllCurrencyDepositHistory(paginationOptions);
```

### All Transaction History

```javascript
const history = await swyftx.getAllTransactionHistory(paginationOptions);
```

### Affiliate Payout History

```javascript
const history = await swyftx.getAffiliatePayoutHistory(paginationOptions);
```

## Limits Endpoints

### Withdrawal Limits

```javascript
const limits = await swyftx.getWithdrawalLimits();
```

## Markets Endpoints

### Live Rates

**primaryAsset**: The asset to view the live rates in (default is USD)

```javascript
//Live rates defaults to USD
const liveRates = await swyftx.getLiveRates();

//Specify rates in terms of AUD (assetId = 1)
const liveRatesAUD = await swyftx.getLiveRates(1);
```

### Market Assets

```javascript
const marketAssets = await swyftx.getMarketAssets();
```

### Basic Asset Info

**asset**: The asset you would like information on

```javascript
//Get for all assets
const basicInfo = await swyftx.getBasicInfo();

//Get for a specific asset
const basicInfo = await swyftx.getBasicInfo("LTC");
```

### Detailed Asset Info

**asset**: The asset you would like information on

```javascript
//Get for all assets
const detailedInfo = await swyftx.getDetailedInfo();

//Get for a specific asset
const detailedInfo = await swyftx.getDetailedInfo("LTC");
```

## Alert Endpoints

### Get Price Alerts

**paginationOptions**: Pagination object - contains primary, secondary, limit, from, to, status

**primary** (optional): AssetId for primary asset

**secondary** (optional): AssetId for secondary asset

**limit** (optional): Maximum entries per page

**from** (optional): Return results after this date

**to** (optional): Return results before this date

**status** (optional): Comma separated list of statuses to include

```javascript
const paginationOptions = {
  primary: 1
}
const response = await swyftx.getPriceAlerts(paginationOptions);
```

### Create Price Alert

**primary**: AssetId of the primary asset for the alert

**secondary**: AssetId of the secondary asset for the alert

**price**: The price of the primary asset at which the alert will trigger

```javascript
const response = await swyftx.createPriceAlert(1, 5, 1000);
```

### Delete Price Alert

**uuid**: The Uuid of the Alert that you want to delete

```javascript
const response = await swyftx.cancelPriceAlert(alertId);
```

## Orders Endpoints

### Pair Echange Rate

**data**: Includes buy, sell, amount and limit

**buy**: The currency you would be buying

**sell**: The currency you would be selling

**amount**: The amount to limit the exchange at

**limit**: The currency that the limit will stop at

```javascript
const data = {
  "buy": "BTC",
  "sell": "USD",
  "amount": 1000,
  "limit": "USD"
}
const pairExchangeRate = await swyftx.getPairExchangeRate(data);
```

### Place Order

For documentation on placing an order, see the Ordering section

**data**: contains primary, secondary, quantity, assetQuantity, orderType and trigger

**primary**: The primary currency to buy/sell

**secondary**: The secondary currency to buy/sell

**quantity**: The amount of the currency to trade

**assetQuantity**: Which asset the quantity is in

**orderType**: ENUM (MARKET_BUY, MARKET_SELL, LIMIT_BUY, LIMIT_SELL, STOP_LIMIT_BUY, STOP_LIMIT_SELL)

**trigger**: When to execute the trade - in terms of primary/secondary

```javascript
//Buy 100 ADA at the current USD market price
const data = {
  "primary": "USD",
  "secondary": "ADA",
  "quantity": 100,
  "assetQuantity": "ADA",
  "orderType": "MARKET_BUY",
  "trigger": ""
}
const response = return await self.placeOrder(data);
```

### Dust Order

**data**: An object cointaining a *selected* array with all of the currencies to dust

```javascript
const data = {
  "selected": [
    1, 5, 10
  ]
}
const response = await swyftx.dustOrder(data);
```

### Cancel Order

**orderUuid**: The UUID of the order that you want to cancel

```javascript
const orderUuid = "YOUR_ORDER_UUID";
const response = await swyftx.cancelOrder(orderUuid);
```

### List Orders

**assetCode** (optional): The asset that you'd like to see orders for

```javascript
//Get all orders
const allOrders = await swyftx.listOrders();

//Orders for LTC
const ordersLTC = await swyftx.listOrders("LTC");
```

### Get Order By UUID

**UUID**: The UUID of the order you would like information on

```javascript
const orderUuid = "YOUR_ORDER_UUID";
const orderInfo = await swyftx.getOrderByUuid(orderUuid);
```

## Recurring Orders Endpoints

### Get Recurring Orders

```javascript
const recurringOrders = await swyftx.getRecurringOrders();
```

### Get Recurring Orders Stats

**templateUuid**: The UUID for the recurring order template you wants stats on

```javascript
const templateUuid = "YOUR_TEMPLATE_UUID";
const recurringOrderStats = await swyftx.getRecurringOrderStats(templateUuid);
```

### Create Recurring Order

**data**: Contains template, primaryAssetId, label and source

**template**: An object with assetIds and their percentage make up of the order

**primaryAssetId**: The asset to use to pay for the recurring order

**label**: The name for the recurring order template

**source**: The source of the recurring order (only DEPOSIT is accepted at the current stage)

```javascript
const data = {
  "template": {
    "3": 50,
    "5": 50
  },
  "primaryAssetId": "1",
  "label": "BTC & ETH",
  "source": "DEPOSIT"
}
const response = await swyftx.createRecurringOrder(data);
```

### Delete Recurring Order

**templateUuid**: The UUID for the recurring order template you want to delete

```javascript
const templateUuid = "YOUR_TEMPLATE_UUID";
const recurringOrderStats = await swyftx.deleteRecurringOrder(templateUuid);
```

## Swap Endpoints

### Swap Crypto Assets

**data**: contains primary, secondary, quantity, assetQuantity, orderType and trigger

**buy**: The assetId of the asset you'd like to buy
**sell**: The assetId of the asset you'd like to sell
**limitAsset**: The asset to limit the swap
**limitQty**: The quantity of the asset you'd like to sell
**intermediateAssetId**: The sell asset will be traded to this, then the buy asset

```javascript
const data = {
  "buy": "5",
  "sell": "36",
  "limitAsset": 36,
  "limitQty": "20",
  "intermediateAssetId": "3"
}
const response = await swyftx.executeSwap(data);
```

## Compare Endpoints

### Compare Exchange

**exchange**: The exchange to compare (currently only 'coinspot' and 'swyftx')

```javascript
const exchange = "coinspot";
const comparison = await swyfyx.compareExchange(exchange);
```

## Message Endpoints

Both endpoints have a single parameter

**limit**: The amount of entries to retrieve (default is 25)

### Get Latest Messages

```javascript
//Get 25 newest messages
const messages = await swyftx.getLatestMessages();

//Get 80 newest messages
const messages = await swyftx.getLatestMessages(80);
```

### Get Latest Announcements

```javascript
//Get 25 newest messages
const messages = await swyftx.getLatestAnnouncements();

//Get 80 newest messages
const messages = await swyftx.getLatestAnnouncements(80);
```

## Info Endpoint

### Get Api Info

```javascript
const apiInfo = await swyftx.getApiInfo();
```

## Portfolio Endpoints

### Get Trade Price History

**denotedAssetId**: AssetId you want to see the trade price history of

```javascript
const response = await swyftx.getTradePriceHistory(5);
```

### Get Asset Activity

**assetId**: AssetId you want to see the history of

**paginationOptions**: Pagination object - contains page, limit, sortKey, sortDirection, startDate, endDate, type, status

**page** (optional): Page number to start from

**limit** (optional): Limit of entries per page

**sortKey** (optional): Field on which to sort items

**sortDirection** (optional): Direction in which to sort

**startDate** (optional): Return results after this date

**endDate** (optional): Return results before this date

**type** (optional): Comma separated list of types to include

**status** (optional): Comma separated list of statuses to include

```javascript
  const paginationOptions = {
    page: 0,
    limit: 20
  }
  const response = await swyftx.getAssetActivity(5, paginationOptions);
```

## ORDERING IN DEPTH

When making an order using the wrapper, you should always keep in mind that the default primary currency is USD. So make sure to make any conversions if needed.

**For ease of use** I have wrapped some common ordering patterns in methods which are explained below.

### Parameters for Order functions

**primary**: The primary currency - default is "USD"

**secondary**: The coin you're buying or selling ("BTC", "LTC", "DOGE")

**quantity**: the amount to trade. Which currency it is referring to depends on what the fiat variable is set to (default is to use fiat currency)

**trigger**: For limit/stop limit orders. The price at which to trigger the trade. This is in terms of primary/secondary

**fiat**: The currency with which to trade. Setting to true will trade using priamry, false will use the secondary


## Examples

**Assuming wrapper has been instantiated as *swyftx***

```javascript
//Buy 1000 Doge coin when it drops to $0.05 per coin
const response = await swyftx.placeLimitBuyOrder("DOGE", 1000, 0.05, fiat=false);
```

```javascript
//Instantly sell $200 USD worth of Litecoin at the current market price
const response = await swyftx.instantSell("LTC", 200, fiat=true)
```

```javascript
//Buy 0.3 BTC when the price reaches $80,000 USD
const response = await swyftx.placeStopLimitBuyOrder("BTC", 0.3, 80000, fiat=false)
```
