'use strict';

var rpc = require('./rpc.js')
  , logger = require('./logger.js')
  , states = require('./states.js')
  ;

function Execution(uuid) {
  this.uuid = uuid;
  this.state = states.pending;
}

Execution.prototype.start = function () {
  this.changeState(states.running);

  rpc.cast('execute', { execution: this.uuid, task: 'task-' + Math.random().toString() });

  return this;
};

Execution.prototype.stop = function () {
  this.changeState(states.suspending);
};

Execution.prototype.handleTask = function (taskId, results) {
  logger.info('task', taskId, 'completed:', results);
  if (this.state === states.running) {
    rpc.cast('execute', { execution: this.uuid, task: 'task-' + Math.random().toString() });
  }
};

Execution.prototype.changeState = function (state) {
  this.state = state;

  return this;
};

module.exports = Execution;
