'use strict';

var _ = require('lodash')
  // Is doesn't seem right that we connecting to the queue at the moment we requiring rpc the first time,
  // although it's handy and it's what we want most of the time. Need to carefully think about that.
  , rpc = require('./rpc.js')
  , logger = require('./logger.js')
  , nUUID = require('node-uuid')
  , states = require('./states.js')
  , storage = require('./storage.js')
  ;

function Execution(json) {
  this.update(_.defaults(json || {}, {
    state: states.pending
  }));
}

Execution.prototype.start = function () {
  return this.changeState(states.running).then(function () {
    rpc.cast('execute', { execution: this.uuid, task: nUUID.v4() });

    return this;
  }.bind(this));
};

Execution.prototype.stop = function () {
  return this.changeState(states.suspending);
};

Execution.prototype.handleTask = function (taskId, results) {
  logger.info('task', taskId, 'completed:', results);
  if (this.state === states.running) {
    rpc.cast('execute', { execution: this.uuid, task: nUUID.v4() });
  }
};

Execution.prototype.changeState = function (state) {
  this.state = state;
  return this.save();
};

Execution.prototype.json = function () {
  return {
    _id: this.uuid,
    state: this.state
  };
};

Execution.prototype.update = function (json) {
  this.uuid = json._id;
  this.state = json.state;

  return this;
};

Execution.prototype.save = function () {
  return storage.saveExecution(this);
};

module.exports = Execution;
