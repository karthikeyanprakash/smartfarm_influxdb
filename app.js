const Influx = require('simple-influx');
var influxClient = require('./deluge2influx-master/deluge2influx.js')
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://iot.eclipse.org')

client.on('connect', function () {
  console.log("Connected");
  client.subscribe('techo/smartfarm/321')

})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  var messageObject = message.toString();

  try {
    messageObject = JSON.parse(messageObject);
  } catch (e) {
    return console.error(e);
  }

  console.log(messageObject.t);
  console.log(messageObject.h);
  console.log(messageObject.m);

  var value = {
      temp: messageObject.t,
      humid: messageObject.h,
      moisture: messageObject.m
  };

  var tags = {
      type: "measurement",
  };
  influxClient.writeToInflux('farm', value, tags).then(function() {
      console.log("done");
  });
})


// setInterval(function() {
//     // authDeluge(onAuthDeluge);
//     function getRandomInt(max) {
//       return Math.floor(Math.random() * Math.floor(max));
//     }
//
//     var value = {
//         temp: getRandomInt(50),
//         humid: getRandomInt(100)
//     };
//
//     var tags = {
//         type: "measurement",
//     };
//     influxClient.writeToInflux('farm', value, tags).then(function() {
//         console.log("done");
//     });
// }, 2500);
