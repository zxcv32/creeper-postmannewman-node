#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    var queue = 'creeper-postmannewman';
    var msg = JSON.stringify({
      "info": {
        "_postman_id": "2382ea41-b113-458a-9d52-d4a9fbeb25e6",
        "name": "newman_coll",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
      },
      "item": [
        {
          "name": "json sample",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "https://jsonplaceholder.typicode.com/posts",
              "protocol": "https",
              "host": [
                "jsonplaceholder",
                "typicode",
                "com"
              ],
              "path": [
                "posts"
              ]
            }
          },
          "response": []
        }
      ]
    });

    channel.assertQueue(queue, {
      durable: false
    });
    channel.sendToQueue(queue, Buffer.from(msg));

    console.log("Sent collection to queue: '%s'", queue);
  });
  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 500);
});