# through-slice

Like `Array.prototype.slice` but for streams (using the [through](https://www.npmjs.com/package/through) module). Given a `start` and optionally an `end` value it will return a through stream that emits the `data` event when elements match the slice range.

Note that when the `start` or `end` values are negative, the module will buffer the results until they match the range (as they require knowing the total length), and will emit individual `data` events but only when the stream has finished (right before the `end` event). Ideally these ranges would not be used.

## Example

```js
// demo.js
var slice = require('./');
var JSONStream = require('JSONStream');

process.stdin
  .pipe(JSONStream.parse('*'))
  .pipe(slice(2, 4)) // show 2nd & 3rd item
  .on('data', function (data) {
    console.log(data); // logs twice
  });
```

Usage:

```shell
curl --silent https://api.github.com/repos/octocat/Hello-World/issues | node demo.js
```

## Installation

```shell
npm install --save through-slice
```