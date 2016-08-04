# unzip-crx

__Unzip chrome extension files__

[![Build Status](https://travis-ci.org/peerigon/unzip-crx.svg?branch=master)](https://travis-ci.org/peerigon/unzip-crx) [![Dependency Status](https://david-dm.org/peerigon/unzip-crx.svg)](https://david-dm.org/peerigon/unzip-crx) [![Coverage Status](https://coveralls.io/repos/github/peerigon/unzip-crx/badge.svg?branch=master)](https://coveralls.io/github/peerigon/unzip-crx?branch=master)

If you want to unzip [Chrome extension files](https://developer.chrome.com/extensions) (*.crx) you might have the problem that your unzip lib claims that the file header is malformed. This is due to that Chrome [adds some extra information](https://developer.chrome.com/extensions/crx) for identifying crx files. `unzip-crx` handles those additional headers and unzips as usual.

This lib is highly inspired by [crx2ff](https://github.com/abarreir/crx2ff) from [abarreir](https://github.com/abarreir), thanks!

## Installation

```
$ npm install unzip-crx
```

## Example

```js
const unzip = require("unzip-crx");

const crxFile = "./this-chrome-extension.crx";

unzip(crxFile).then(() => {
  console.log("Successfully unzipped your crx file..");
});

```

## API

### unzip(file[, destination])

Resolves with a Promise if the file was unzipped successfully, throws otherwise (use `.catch()`).



## Contributing

From opening a bug report to creating a pull request: **every contribution is appreciated and welcome**. If you're planing to implement a new feature or change the api please create an issue first. This way we can ensure that your precious work is not in vain.

All pull requests should have 100% test coverage (with notable exceptions) and need to pass all tests.

- Call `npm test` to run the unit tests
- Call `npm run coverage` to check the test coverage (using [istanbuljs/nyc](https://github.com/istanbuljs/nyc))

## LICENSE

MIT
