'use strict'
var Timer = {};

var running = false;
var timer_loop;


Timer.time = 0;
Timer.start = function () {
  if (!running) {
    running = true;
    var start_time = new Date().getTime() - Timer.time;
    timer_loop = setInterval(function () {
      Timer.time = new Date().getTime() - start_time;
      $("#time").text(Timer.getTime());
    }, 9);
  }
  else
    console.log("Timer already running")
}

Timer.stop = function () {
  if (running) {
    clearInterval(timer_loop);
    running = false;
  }
  else
    console.log("Timer is not running")
}

Timer.reset = function () {
  Timer.time = 0;
}

Timer.getTime = function () {
  return Timer.format(Timer.time);
}

Timer.format = function (time) {
  var ms = "" + (time%1000);
  while(ms.length < 3)
    ms = "0" + ms;
  return Math.floor(time/1000) + ":" + ms;
}
