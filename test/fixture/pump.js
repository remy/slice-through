'use strict';
var stream = require('stream');
var util = require('util');

function Readable(size) {
  this.size = size;
  stream.Readable.call(this, {objectMode: true});
  this.ctr = 0;
}

util.inherits(Readable, stream.Readable);

Readable.prototype._read = function () {
  if (this.size > 0) {
    setImmediate(function () {
      this.push(++this.ctr);
    }.bind(this));
    this.size--;
  } else {
    this.push(null);
  }
};

module.exports = Readable;