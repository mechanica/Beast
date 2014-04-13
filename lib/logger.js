'use strict';

var _ = require('lodash')
  , cluster = require('cluster')
  , config = require('mech-config')
  , moment = require('moment')
  , winston = require('winston')
  ;

var label = (function () {
  if (cluster.isMaster) {
    return 'master';
  }

  if (cluster.isWorker) {
    return [process.env.type, '/', '#' + cluster.worker.id].join(' ');
  }
})();

var TRANSPORTS = {
  'console': {
    // TODO: Somehow, default implementation of Console transport refuses to output TypeErrors (and probably
    // others) and needs to be fixed by issuing message.toString().
    cls: winston.transports.Console,
    parser: function (settings) {

      // If timstamp is a string, make it a function that returns formated Date object.
      if (_.isString(settings.timestamp)) {
        var format = _.clone(settings.timestamp);
        settings.timestamp = function () {
          return moment().format(format);
        };
      }

      return settings;
    }
  }
}

var logger = new (winston.Logger)({
  transports: _.map(config.log, function (settings, transport) {
    transport = TRANSPORTS[transport];

    settings = _.clone(settings)
    settings = _.defaults(transport.parser ? transport.parser(settings) : settings, {
      label: label
    });

    return new (transport.cls)(settings);
  })
});

module.exports = logger;
