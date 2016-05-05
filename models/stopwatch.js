var util    = require('util'),
    events  = require('events').EventEmitter;
var log = require('../lib/log')(module); 

function Stopwatch() {
    if(false === (this instanceof Stopwatch)) { //singletone
        return new Stopwatch();
    }

  this.seconds = 10;
  this.interval = 1000; 
  this.timer = null;

    events.call(this);
};

util.inherits(Stopwatch, events); //same as Stopwatch.prototype.__proto__ = EventEmitter.prototype;

Stopwatch.prototype.start = function() {
  var self = this;
  log.info("Stopwatch Started!");

  self.timer = setInterval(function () {
    self.emit('tick', self.seconds);

    if (--self.seconds < 0) {
      self.stop();
      self.emit('end');
      log.info("Stopwatch Finished!");
    }
  }, self.interval);

  return true;
};

Stopwatch.prototype.stop = function() {
  clearInterval(this.timer);
  this.timer = null;
};

Stopwatch.prototype.started = function() {
  return !!this.timer;                          //https://habrahabr.ru/sandbox/44911/ it means if defined return value
};


Stopwatch.prototype.restart = function() {
  log.info('Resetting Stopwatch!');
  this.stop();
  this.removeAllListeners('tick');
  this.removeAllListeners('end');
  this.start();
};

module.exports = Stopwatch;