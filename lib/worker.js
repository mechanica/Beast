'use strict';

var logger = require('./logger.js')
  , rpc = require('./rpc.js')
  ;

rpc.handle('command', function (msg) {
  this.ack(msg);
});
