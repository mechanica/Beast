'use strict';

var amqp = require('amqp')
  , config = require('mech-config')
  , logger = require('./logger.js')
  ;

var connection = amqp.createConnection(config.queue.connection);

connection.on('ready', function(){
  connection.exchange(config.queue.exchange, {type: 'direct'}, function (exchange) {
    connection.queue(exchange.name, function(queue) {

      queue.bind(exchange, '');

      queue.subscribe(function(msg){
        logger.info('Received', msg.data.toString('utf-8'));
      });

      logger.info('Ready');

    });
  });
});

connection.on('error', logger.error);
