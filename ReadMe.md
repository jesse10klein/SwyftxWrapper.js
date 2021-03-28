# swyftxwrapper.js

swyftxwrapper.js is a JavaScript wrapper for the Australian Cryptocurrency trading platform Swyftx.

## Installation

To install swyftwrapper.js simple use NPM in a terminal

```bash
npm install swyftxwrapper.js
```

## Usage

To use the package, simply require it. Make sure to generate an access token before making any calls.

```javascript
const Swyftx = require("swyftxwrapper.js");

const swyftx = Swyftx("YOUR_API_KEY");

const main = async () => {
  await swyftx.generateRefreshToken();

  //Make any calls to the API you'd like... for example
  const litecoinData = await swyftx.getBasicInfo("LTC");
  console.log(liteCoinData);
}

main();
```

For DEMO use, simply set demo to true when instantiating the wrapper

```javascript

const swyftx = Swyftx("YOUR_API_KEY", demo=true);

```

