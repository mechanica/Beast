'use strict';

var amqp = require('amqplib')
  , config = require('mech-config')
  , logger = require('./logger.js')
  ;

function RPC() {
  this.connection = amqp.connect('amqp://localhost');

  this.channel = this.connection.then(function (conn) {
    var channel = conn.createChannel();

    logger.silly('channel ready');

    return channel;
  });

  this.exchange = this.channel.then(function (ch) {
    ch.assertExchange(config.queue.exchange.name, 'direct', {
      durable: config.queue.exchange.durable,
      autoDelete: config.queue.exchange.autoDelete
    });

    logger.silly('exchange ready');

    return ch;
  });

  this.exchange.then(null, logger.error);
}

RPC.prototype.handle = function (command, cb) {
  this.exchange.then(function (ch) {
    var exchange = config.queue.exchange.name
      , queue = [config.queue.exchange.name, command].join('.');

    ch.assertQueue(queue);
    ch.bindQueue(queue, exchange, command);

    logger.silly('queue ready');

    ch.consume(queue, function (msg) {
      var message = JSON.parse(msg.content);

      logger.debug(command, 'received:', message);

      return cb.call({
        ack: function () {
          ch.ack(msg);
        }
      }, message);
    });

    return ch;
  }).then(null, logger.error);
};

RPC.prototype.cast = function (command, message) {
  this.exchange.then(function(ch) {
    var msg = JSON.stringify(message);

    ch.publish(config.queue.exchange.name, command, new Buffer(msg));

    logger.debug(command, 'sent:', message);

    return ch;
  }).then(null, logger.error);
};

module.exports = new RPC();
