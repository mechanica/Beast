'use strict';

var rpc = require('./rpc.js')
  , logger = require('./logger.js')
  ;

function Execution(uuid) {
  this.uuid = uuid;
}

Execution.prototype.start = function () {
  rpc.cast('execute', { execution: this.uuid, task: 'task-' + Math.random().toString() });

  return this;
};

Execution.prototype.stop = function () {
  clearInterval(this._interval);
};

Execution.prototype.handleTask = function (taskId, results) {
  logger.info('task', taskId, 'completed:', results);
  rpc.cast('execute', { execution: this.uuid, task: 'task-' + Math.random().toString() });
};

module.exports = Execution;
