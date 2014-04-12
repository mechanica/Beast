'use strict';

var amqp = require('amqp')
  , logger = require('./logger.js')
  ;

var connection = amqp.createConnection({host: 'localhost'});

connection.on('ready', function(){
  connection.exchange('logs', {type: 'direct'}, function(exchange){

    setInterval(function () {
      var message = 'SOME';
      exchange.publish('', message);
      logger.info('Sent', message);
    }, 1000);

    logger.info('Ready');

  });
});

connection.on('error', console.error);
