'use strict';

var amqp = require('amqp')
  , logger = require('./logger.js')
  ;

var connection = amqp.createConnection({host: 'localhost'});

connection.on('ready', function(){
  connection.exchange('logs', {type: 'direct'}, function(exchange){
    connection.queue(exchange.name, function(queue) {

      queue.bind(exchange, '');

      queue.subscribe(function(msg){
        logger.info('Received', msg.data.toString('utf-8'));
      });

      logger.info('Ready');

    });
  });
});

connection.on('error', console.error);
