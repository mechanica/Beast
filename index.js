'use strict';

var cluster = require('cluster')
  ;

if (cluster.isMaster) {
  for (var i = 0; i < 10; i++) {
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
