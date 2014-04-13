'use strict';

var amqp = require('amqplib')
  , config = require('mech-config')
  , logger = require('./logger.js')
  ;

function RPC() {
  // Connecting the MQ server
  this.connection = amqp.connect(config.queue.url);

  // Setting up a channel
  this.channel = this.connection.then(function (conn) {
    var channel = conn.createChannel();

    logger.silly('channel ready');

    return channel;
  });

  // Checking for Exchange. If absent, one will be created.
  this.exchange = this.channel.then(function (ch) {
    ch.assertExchange(config.queue.exchange.name, 'direct', {
      durable: config.queue.exchange.durable,
      autoDelete: config.queue.exchange.autoDelete
    });

    logger.silly('exchange ready');

    return ch;
  });

  // Handling the errors if there were any. Although, I'm wondering do we need to do it now or at invocation.
  this.exchange.then(null, logger.error);
}

RPC.prototype.handle = function (command, cb) {
  // When exchange will be ready
  return this.exchange.then(function (ch) {
    var exchange = config.queue.exchange.name
      , queue = [config.queue.exchange.name, command].join('.');

    // Check for queue
    ch.assertQueue(queue);
    ch.bindQueue(queue, exchange, command);

    logger.silly('queue ready');

    // Start consuming the messages
    ch.consume(queue, function (msg) {
      var message = JSON.parse(msg.content);

      logger.debug(command, 'received:', message);

      // Give handler the ability to ack\requeue without direct access to both channel and raw message.
      var controls = {
        ack: function () { ch.ack(msg); },
        nack: function () { ch.nack(msg); }
      };

      return cb.call(controls, message);
    });

    return ch;
  }).then(null, logger.error);
};

RPC.prototype.cast = function (command, message) {
  return this.exchange.then(function(ch) {
    var msg = JSON.stringify(message);

    ch.publish(config.queue.exchange.name, command, new Buffer(msg));

    logger.debug(command, 'sent:', message);

    return ch;
  }).then(null, logger.error);
};

module.exports = new RPC();
