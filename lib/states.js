'use strict';

var _ = require('lodash')
  ;

var States = module.exports;

_.assign(States, {
  running: 'RUNNING',
  pending: 'PENDING',
  suspending: 'SUSPENDING',
  suspended: 'SUSPENDED'
});
