'use strict';

var rpc = require('./rpc.js')
  ;

setInterval(function () {
  rpc.cast('execute', 'ZOME');
}, 1000);
