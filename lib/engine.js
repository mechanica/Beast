'use strict';

var amqp = require('amqp')
  , config = require('mech-config')
  , logger = require('./logger.js')
  ;

var connection = amqp.createConnection(config.queue.connection);

connection.on('ready', function () {
  connection.exchange(config.queue.exchange, {type: 'direct'}, function (exchange) {

    setInterval(function () {
      var message = 'SOME';
      exchange.publish('', message);
      logger.info('Sent', message);
    }, 1000);

    logger.info('Ready');

  });
});

connection.on('error', logger.error);
