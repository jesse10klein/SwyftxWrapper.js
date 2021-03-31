# swyftxwrapper.js Usage Guide

## Ordering

When making an order using the wrapper, you should always keep in mind that the default primary currency is USD. So make sure to make any conversions if needed.

**For ease of use** I have wrapped some common ordering patterns in methods which are explained below. If for some reason you'd like to use the generic ordering endpoint, this is still available and is used like this:

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

### Parameters for Order functions

**primary**: The primary currency - default is "USD"

**secondary**: The coin you're buying or selling ("BTC", "LTC", "DOGE")

**quantity**: the amount to trade. Which currency it is referring to depends on what the fiat variable is set to (default is to use fiat currency)

**trigger**: For limit/stop limit orders. The price at which to trigger the trade. This is in terms of primary/secondary


## Examples

**Assuming wrapper has been instantiated as *swyftx***

```javascript
//Buy 1000 Doge coin when it drops to $0.05 per coin
const response = await swyftx.placeLimitBuyOrder("DOGE", 1000, 0.05 fiat=false);
```

```javascript
//Instantly sell $200 USD worth of Litecoin at the current market price
const response = await swyftx.instantSell("LTC", 200, fiat=true)
```

```javascript
//Buy 0.3 BTC when the price reaches $80,000 USD
const response = await swyftx.placeStopLimitBuyOrder("BTC", 0.3, 80000, fiat=false)
```
