var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var mqtt = require("mqtt");
var client = mqtt.connect("mqtt://test.mosquitto.org");

app.use(bodyParser.json());

app.post("/", function(req, res) {
    res.send();
    console.log(req.body);
    client.publish("fromFlowRouteCoffee", JSON.stringify(req.body));
});

app.listen(3001, function() {
    console.log("FlowRoute Coffee Bridge running on port 3001!");
});
