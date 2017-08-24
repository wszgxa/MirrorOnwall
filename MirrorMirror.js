'use strict';
const awsIot = require('aws-iot-device-sdk');

var app = {}
app.TOPIC_IMAGES = "MagicMirror:new-images"
app.TOPIC_TEXT = "MagicMirror:new-text"
app.TOPIC_MODULE = "MagicMirror:change-module"
app.TOPIC_VIDEO = "MagicMirror:new-video"
app.TOPIC_FAIREST = "MagicMirror:fairest-image"
app.TOPIC_SCORE = "MagicMirror:dress-score"
app.TOPIC_SHOP = "MagicMirror:dress-shop"

// Setup our AWS IoT device and receive messages
app.setup = function() {
  app.device = awsIot.device({
    keyPath: __dirname + "/certs/MagicMirror.private.key",
    certPath: __dirname + "/certs/MagicMirror.cert.pem",
    caPath: __dirname + "/certs/root-CA.crt",
    clientId: "MagicMirror" + (new Date().getTime()),
    region: "us-east-1",
    host: "a3ucfu43ts5i5t.iot.us-east-1.amazonaws.com",
  });

  /**
   * AWS IoT - Connecting MagicMirror as a device to our AWS IoT topics
   */
  console.log("Attempt to connect to AWS ");
  app.device.on("connect", function() {
    console.log("Connected to AWS IoT");

    app.device.subscribe(app.TOPIC_TEXT);
    console.log("Subscribed: " + app.TOPIC_TEXT);

    app.device.subscribe(app.TOPIC_IMAGES);
    console.log("Subscribed: " + app.TOPIC_IMAGES);

    app.device.subscribe(app.TOPIC_FAIREST);
    console.log("Subscribed: " + app.TOPIC_FAIREST);

    app.device.subscribe(app.TOPIC_MODULE);
    console.log("Subscribed: " + app.TOPIC_MODULE);

    app.device.subscribe(app.TOPIC_VIDEO);
    console.log("Subscribed: " + app.TOPIC_VIDEO);
    
    app.device.subscribe(app.TOPIC_SCORE);
    console.log("Subscribed: " + app.TOPIC_SCORE);

    app.device.subscribe(app.TOPIC_SHOP);
    console.log("Subscribed: " + app.TOPIC_SHOP);
  });

  // Listeners
  app.device.on("message", function(topic, payload) {
    var JSONpayload = JSON.parse(payload.toString());

    // If successfull, let's let our application know
    for (var i = 0; i < app.callbacks.length; i++) {
      app.callbacks[i](topic, JSONpayload);
    }
  })
}

// Callbacks that will be invoked when a message is received
app.callbacks = [];

app.onMessage = function(callback) {
  app.callbacks.push(callback);
}

module.exports = app
