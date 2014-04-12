'use strict';

var logger = require('./logger.js')
  , rpc = require('./rpc.js')
  ;

rpc.handle('execute', function (msg) {
  this.ack();
  setTimeout(function () {
    rpc.cast('results', { execution: msg.execution, task: msg.task, result: Math.random().toString()});
  }, 1000 * Math.random());
});
