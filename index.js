var gpio = require("gpio");
var mqtt = require("mqtt");
var mqttClient = mqtt.connect("mqtt://test.mosquitto.org");
var FlowrouteSMS = require("flowroute-sms");
var config = require("./config.json");
var smsClient = new FlowrouteSMS(config.accessKey, config.secretKey);

var seatNumber = "F8";    // F denotes a fake table
var from = "12015354459"; // own FlowRoute number
var to = "17738015085";

var orderInProgress = false;
var green = gpio.export(18);
var red = gpio.export(19);
var button = gpio.export(17, {
    direction: "in"
});


mqttClient.on("connect", function() {
    mqttClient.subscribe("fromFlowRouteCoffee");
});

mqttClient.on("message", function(topic, message) {
    var data = JSON.parse(message.toString());

    console.log(data.body);
    if(data.body === "What is your seat number?") {
        console.log(seatNumber);
        smsClient.send(to, from, seatNumber)
        .then(function(result) {
            console.log("Sent message from " + from + " to " + to + " with body: " + seatNumber, result.id);
            greenFlash();
            return;
        });
    }

    if(data.body === "Your order has been received!") {
        green.set(1);
        return startRedFlash();
    }

    if(data.body === "Enjoy your Flow Brew!") {
        green.set(0);
        orderInProgress = false;
        return stopRedFlash();
    }

    red.set(1);
    setTimeout(() => {red.set(0); }, 1000);
});

function greenFlash() {
    green.set();
    setTimeout(function() { green.reset(); }, 500);
}

var redFlashInterval;
function startRedFlash() {
    redFlashInterval = setInterval(function() {
        red.set();
        setTimeout(function() { red.reset(); }, 500);
    }, 1000);
}

function stopRedFlash() {
    clearInterval(redFlashInterval);
    red.set(0);
}

button.on("change", buttonPressed);

var lastPress = new Date();
function buttonPressed(val) {
    var thisPress = new Date();
    var duration = thisPress - lastPress;
    lastPress = thisPress;
    if(duration < 800) {
        return;
    }

    if(!orderInProgress) {
        orderCoffee();
    }
}

function orderCoffee() {
    smsClient.send(to, from, "NITRO")
    .then(function(result) {
        orderInProgress = true;
        console.log("Sent message from " + from + " to " + to + " with body: NITRO", result.id);
        greenFlash();
    });
}
