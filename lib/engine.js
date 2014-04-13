'use strict';

var storage = require('./storage.js')
  , rpc = require('./rpc.js')
  , logger = require('./logger.js')
  ;

storage.createExecution().then(function (execution) {
  return execution.start();
}, function (err) {
  logger.error(err.toString());
});

rpc.handle('results', function (msg) {
  var self = this;

  // Start by fetching the execution
  var ok = storage.getExecution(msg.execution);

  // Continue by handling the results
  ok = ok.then(function (execution) {
    return execution.handleTask(msg.task, msg.result);
  });

  // And only then acknowledge the message. This way it will be requeued if something go south.
  ok = ok.then(function () {
    self.ack();
  }, function (err) {
    self.nack();
    logger.error(err);
  });
});
