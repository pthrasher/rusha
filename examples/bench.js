if (typeof require === 'function') {
  var crypto = require('crypto');
  var johnston = require('./bench/johnston');
  var Rusha = require('../rusha');
  var cifre_utils = require('./bench/cifre/utils.js');
  var cifre_sha1 = require('./bench/cifre/sha1.js');
  var random = require('./random');
  var fnNative = random.fnNative,
      randomBytes = random.randomBytes;
}

var sizes = [4*1024, 1024*1024, 4*1024*1024, 8*1024*1024];

var _rush = new Rusha(Math.max.apply(Math, sizes)),
    fnRusha = function (bytes) {
  return _rush.digestFromBuffer(bytes);
};

var fnJohnston = function (bytes) {
  return johnston(bytes);
};

var fnCifre = function (bytes) {
  return cifre_utils.tohex(cifre_sha1(bytes));
};

var ids = ['Native  ', 'Rusha   ', 'Johnst. ', 'Cifre   '];
var fns = [fnNative, fnRusha, fnJohnston, fnCifre];

var bench = function () {
  sizes.forEach(function (size) {
    console.log('Benchmarking ' + size + ' bytes ...');
    var bytes = randomBytes(size);
    fns.forEach(function (fn, i) {
      var t0 = (new Date()).getTime();
      var res = fn(bytes);
      var t1 = (new Date()).getTime();
      console.log(ids[i] + ' emitted ' + res + ' in ' + (t1-t0) + ' milliseconds');
    });
  });
}

bench();

