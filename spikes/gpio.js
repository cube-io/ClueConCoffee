var gpio = require("gpio");

var button = gpio.export(17, {
  direction: "in",
});

var green = gpio.export(18, {
  ready: function() {
    setInterval(function() {
      green.set();
      setTimeout(function() { green.reset(); }, 500);
    }, 1000);
  }
});

red = gpio.export(19, {
  ready: function() {
    button.on("change", buttonPressed);
  }
});

var lastPress = new Date();
function buttonPressed(val) {
  var thisPress = new Date();
  var duration = thisPress - lastPress;
  lastPress = thisPress;
  if (duration < 800) {
    return;
  }

  red.value === 1 ? red.set(0) : red.set(1);
}
