'use strict';
var test = require('tape');
var slice = require('../');
var Pump = require('./fixture/pump');

var collect = function (result) {
  return function (data) {
    result.push(data);
  }
};

test('slicing array of holes keeps it as array of holes', function (t) {
  var array = new Pump(10);
  var result = [];

  array.pipe(slice()).on('data', collect(result)).on('end', function () {
    t.equal(10, result.length);
    t.end();
  });
});

test('various variants of empty array\'s slicing', function (t) {
  var tests = [
    [0, 0],
    [1, 0],
    [0, 1],
    [-1, 0],
  ];

  var compare = [];

  tests.forEach(function (args) {
    t.test('slice(' + args.join(', ') + ')', function (t) {
      var array = new Pump(0);
      var result = [];

      array.pipe(slice.apply(null, args))
        .on('data', collect(result))
        .on('end', function () {
          t.deepEqual(compare, result);
          t.end();
        });
    });
  });
});

test('various forms of arguments omission', function (t) {
  var tests = [
    [],
    [0],
    [undefined],
    ['foobar'],
    [undefined, undefined],
  ];

  var compare = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  tests.forEach(function (args) {
    t.test('slice(' + args.join(', ') + ')', function (t) {
      var array = new Pump(10);
      var result = [];

      array.pipe(slice.apply(null, args))
        .on('data', collect(result))
        .on('end', function () {
          t.deepEqual(compare, result);
          t.end();
        });
    });
  });
});

test('variants of negatives and positive indices', function (t) {
  var tests = [
    { expected: 7, args: [-100] },
    { expected: 3, args: [-3] },
    { expected: 3, args: [4] },
    { expected: 1, args: [6] },
    { expected: 0, args: [7] },
    { expected: 0, args: [8] },
    { expected: 0, args: [100] },
    { expected: 0, args: [0, -100] },
    { expected: 4, args: [0, -3] },
    { expected: 4, args: [0, 4] },
    { expected: 6, args: [0, 6] },
    { expected: 7, args: [0, 7] },
    { expected: 7, args: [0, 8] },
    { expected: 7, args: [0, 100] },
  ];

  tests.forEach(function (test) {
    t.test('slice(' + test.args.join(', ') + ')', function (t) {
      var array = new Pump(7);
      var result = [];

      array.pipe(slice.apply(null, test.args))
        .on('data', collect(result))
        .on('end', function () {
          t.deepEqual(test.expected, result.length);
          t.end();
        });
    });
  });

});

// test('standalone', function (t) {
//   var a = new Pump(7);
//   var result = [];

//   a.pipe(slice(0, -3)).on('data', collect(result)).on('end', function () {
//     t.deepEqual(result, [1, 2, 3, 4]);
//     t.end();
//   });
// });
