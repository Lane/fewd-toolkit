
/*jslint node: true */
'use strict';

var util = require('util');
var gulp = require('gulp');
var runSequence = require('run-sequence').use(gulp);
var logger = require('./lib/fewd-logger');
var FewdCommand = require('./lib/fewd-command');
var FewdTask = require('./lib/fewd-task');

// returns the value of a property in an object
var getConfigProperty = function(configObj, prop) {
  if(typeof prop === 'string') {
    if(configObj.hasOwnProperty(prop)) {
      return configObj[prop];
    } else {
      logger.error("Error: property `" + prop + "` does not exist ");
    }
  } else {
    logger.error("Error: invalid property when getting config.");
  }
  return false;
};


function Fewd(config) {
  this.config = config;
  this.gulp = gulp;
  this.program = false;
}
// util.inherits(Fewd, gulp.Gulp);

Fewd.prototype.useGulp = function() { return this.gulp; };

// functions for setting up the command line tool
Fewd.prototype.setCommander = function (program) { this.program = program; };
Fewd.prototype.getCommander = function () { return this.program; };
Fewd.prototype.isCommanderSet = function () { return this.program; };

Fewd.prototype.getConfig = function () {
  var args = Array.from(arguments);
  var config = this.config;
  for(var i = 0; i < args.length; i++) {
    if(typeof config === 'object') {
      config = getConfigProperty(config, args[i]);
    }
  }
  return config;
};

Fewd.prototype.getConfigItem = function(name) {

};

Fewd.prototype.runTasks = runSequence;

// adds the command to the program, with the description, options, and handler.
Fewd.prototype.addCommand = function (name, description, action, options) {
  var _this = this;
  var command = new FewdCommand(_this, name, description, action, options);
  return command;
};

Fewd.prototype.Task = FewdTask;

// inst.task("default", function() { console.log("handling default"); });
// inst.start.apply(inst, ['default']);

module.exports = function (config) {
  return (new Fewd(config));
};
