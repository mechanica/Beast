'use strict';

var Execution = require('./execution.js')
  , states = require('./states.js')
  ;

var Storage = module.exports;

Storage.createExecution = function () {
  var uuid = 'uuid-' + Math.random().toString();

  return new Execution(uuid);
};

Storage.getExecution = function (uuid) {
  return new Execution(uuid).changeState(states.running);
};
