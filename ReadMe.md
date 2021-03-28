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

The naming convention for calls to the APIs closely match their names on the official API docs.

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

## Endpoints Supported

### Authentication

### Addresses

### Account

### Charts

### Charts v2

### Funds

### History

### Limits

### Markets

### Orders

### Recurring Orders

### Compare

### Messages


