'use strict';

var cluster = require('cluster')
  , config = require('mech-config')
  ;

if (cluster.isMaster) {
  for (var i = 0; i < config.workers; i++) {
    cluster.fork({
      type: 'worker'
    });
  }

  cluster.fork({
    type: 'engine'
  });
} else if (cluster.isWorker) {
  require('./lib/' + process.env.type + '.js');
}
