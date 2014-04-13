'use strict';

var storage = require('./storage.js')
  , rpc = require('./rpc.js')
  ;

storage.createExecution().start();

rpc.handle('results', function (msg) {
  this.ack();

  storage.getExecution(msg.execution).handleTask(msg.task, msg.result);
});
