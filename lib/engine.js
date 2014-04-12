'use strict';

var Execution = require('./execution.js')
  , rpc = require('./rpc.js')
  ;

new Execution('uuid-' + Math.random().toString()).start();

rpc.handle('results', function (msg) {
  this.ack();

  new Execution(msg.execution).handleTask(msg.task, msg.result);
});
