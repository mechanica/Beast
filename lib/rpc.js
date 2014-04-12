'use strict';

var amqp = require('amqplib')
  , config = require('mech-config')
  , logger = require('./logger.js')
  ;

function RPC() {
  this.connection = amqp.connect('amqp://localhost');

  this.channel = this.connection.then(function (conn) {
    var channel = conn.createChannel();

    logger.debug('channel ready');

    return channel;
  });

  this.exchange = this.channel.then(function (ch) {
    ch.assertExchange(config.queue.exchange.name, 'direct', {
      durable: config.queue.exchange.durable,
      autoDelete: config.queue.exchange.autoDelete
    });

    logger.debug('exchange ready');

    return ch;
  });

  this.exchange.then(null, logger.error);
}

RPC.prototype.handle = function (command, cb) {
  this.exchange.then(function (ch) {
    ch.assertQueue(config.queue.exchange.name);
    ch.bindQueue(config.queue.exchange.name, config.queue.exchange.name, command);

    logger.debug('queue ready');

    ch.consume(config.queue.exchange.name, function (msg) {
      logger.info('received', msg.content.toString());

      return cb.call(ch, msg);
    });

    return ch;
  });
};

RPC.prototype.cast = function (command, message) {
  this.exchange.then(function(ch) {
    ch.publish(config.queue.exchange.name, command, new Buffer(message));

    logger.info('sent', message);

    return ch;
  });
};

module.exports = new RPC();
