#!/usr/bin/env node

require('dotenv').config()
const amqp = require('amqplib/callback_api');
const newman = require('newman');
const reporters = (process.env.REPORTERS || 'cli').split(",");
const mqHost = process.env.MQ_HOST || 'localhost';

amqp.connect('amqp://' + mqHost, function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    const queue = 'creeperPostmanNewman';

    channel.assertQueue(queue, {
      durable: false
    });
    console.log("Listening on queue '%s'", queue);
    channel.consume(queue, function (msg) {
      const collectionData = JSON.parse(msg.content.toString());
      console.log("Received a collection named '%s'. Running Newman",
          collectionData.info.name);
      run(collectionData);
    }, {
      noAck: true
    });
  });
});

function run(collectionData) {
  newman.run({
    collection: collectionData,
    reporters: reporters
  }, function (err) {
    if (err) {
      throw err;
    }
    console.log('collection run complete!');
  });
}

