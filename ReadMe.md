# SwyftxWrapper.js

SwyftxWrapper.js is a JavaScript wrapper for the Australian Cryptocurrency trading platform Swyftx.

## Installation

To install SwyftWrapper.js simple use NPM in a terminal

```bash
npm install SwyftxWrapper.js
```

## Usage

To use the package, simply require it. Make sure to generate an access token before making any calls.

```javascript
const Swyftx = require("SwyftxWrapper.js");

const swyftx = Swyftx("YOUR_API_KEY");

const main = async () => {
  await swyftx.generateRefreshToken();

  //Make any calls to the API you'd like... for example
  const litecoinData = await swyftx.getBasicInfo("LTC");
  console.log(liteCoinData);
}

main();
```