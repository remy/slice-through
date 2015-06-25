var through = require('through');

module.exports = function slice(start, end) {
  var i = 0;

  if (!start) {
    start = 0;
  }

  start = parseInt(start, 10);
  if (isNaN(start)) {
    start = 0;
  }

  end = parseInt(end, 10);
  if (isNaN(end)) {
    end = null;
  }

  if (start > -1 && end < 0) {
    console.warn('slice(' + [].slice.call(arguments).join(', ') + ') with a negative end is not efficient with streams and requires buffereing of all data');
  }

  var buffer = []; // used when we slice from the end
  return through(function write(data) {
    if (start > -1 && end < 0) {
      // eg. slice(0, -3)
      // this is the worst case, as the whole shebang is buffered
      // which isn't the point of streams
      if (i >= start) {
        buffer.push(data);
      }
    } else if (start < 0) {
      buffer.push(data);
      buffer = buffer.slice(start);
    } else if (i >= start) {
      if (end == null || i < end) {
        this.emit('data', data);
      }
    }

    i++;

    if (end > 0 && i > end) {
      // stop the stream now we've hit the end of the slice
      this.pause();
      this.end();
    }
  }, function () {
    if (buffer.length) {
      if (end < 0) {
        buffer = buffer.slice(start, end);
      }
      for (var i = 0; i < buffer.length; i++) {
        this.emit('data', buffer[i]);
      }
    }
    this.emit('end');
  });
};
