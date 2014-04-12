'use strict';

var cluster = require('cluster')
  , moment = require('moment')
  , winston = require('winston')
  ;

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: true,
      timestamp: function () {
        return moment().format('MMMM Do YYYY, hh:mm:ss');
      },
      label: (function () {
        if (cluster.isMaster) {
          return 'master';
        }

        if (cluster.isWorker) {
          return [process.env.type, '/', '#' + cluster.worker.id].join(' ');
        }
      })()
    }),
  ]
});

module.exports = logger;
