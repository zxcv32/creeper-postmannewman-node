#!/usr/bin/env node

require('dotenv').config()
const amqp = require('amqplib/callback_api');
const newman = require('newman');
const reporters = (process.env.REPORTERS || 'cli').split(",");
const mqHost = process.env.MQ_HOST || 'localhost';

influxdbReporter = {
  influxdb: {
    server: process.env.INFLUXDB_HOST,
    port: process.env.INFLUXDB_PORT,
    org: process.env.INFLUXDB_ORG,
    version: process.env.INFLUXDB_VERSION,
    username: process.env.INFLUXDB_USERNAME,
    password: process.env.INFLUXDB_PASSWORD,
    name: process.env.INFLUXDB_BUCKET_NAME,
    measurement: process.env.INFLUXDB_MEASUREMENT,
  }
}

amqp.connect('amqp://' + mqHost, function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    const queue = 'creeper-postmannewman';

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
    reporters: reporters,
    reporter: influxdbReporter
  }, function (err) {
    if (err) {
      throw err;
    }
    console.log('collection run complete!');
  });
}

