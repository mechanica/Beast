'use strict';

var rpc = require('./rpc.js')
  , nUUID = require('node-uuid')
  ;

rpc.handle('execute', function (msg) {
  this.ack();
  setTimeout(function () {
    rpc.cast('results', { execution: msg.execution, task: msg.task, result: nUUID.v4() });
  }, 1000 * Math.random());
});
