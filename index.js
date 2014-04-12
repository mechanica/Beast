'use strict';

var cluster = require('cluster')
  , config = require('mech-config')
  ;

if (cluster.isMaster) {
  var i;

  for (i = 0; i < config.instances.workers; i++) {
    cluster.fork({
      type: 'worker'
    });
  }

  for (i = 0; i < config.instances.engines; i++) {
    cluster.fork({
      type: 'engine'
    });
  }
} else if (cluster.isWorker) {
  require('./lib/' + process.env.type + '.js');
}
