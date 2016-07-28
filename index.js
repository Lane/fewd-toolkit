/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

var util = require('util');
var FewdLogger = require('./lib/fewd-logger');
var FewdCommand = require('./lib/fewd-command');
let FewdItem = require('./lib/fewd-item');
// var FewdTask = require('./lib/fewd-task');
// var FewdBatch = require('./lib/fewd-batch');

/** Base class for the FEWD Toolkit. */
class Fewd extends FewdItem {
  /**
   * Set the logger to use for the FEWD toolkit
   */
  setLogger(logger) { this.logger = logger; }

  /**
   * Logs an item using FEWD toolkit's logger
   */
  log() { return this.logger.apply(this, arguments); }

  /**
   * Sets the tool to use for the CLI.
   * @param {Commander} an instance of Commander
   *  https://www.npmjs.com/package/commander
   */
  setCLI(program) { this.program = program; }

  /**
   * Gets the CLI tool set to this instance
   * @return {Commander || false} returns the Commander instance, or false if
   *  no CLI tool has been set.
   */
  getCLI() { return this.program; }


  // Command() { return FewdCommand; }

  /**
   * creates a command and adds it to this FEWD toolkit instance
   */
  createCommand(name, description, action, options) {
    let command = new this.Command(name, description, options);
    if(typeof action === "function") {
      command.addAction(action);
    }
    command.addToInstance(this);
    return command;
  }

}

/**
 * Exposes to the FewdCommand class so it can be extended
 * @return {FewdCommand} the FewdCommand class for extending
 */
Fewd.prototype.Command = FewdCommand;

// export a function that creates a new instance of Fewd.
module.exports = function (config) {
  return (new Fewd(config));
};
