/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

var util = require('util');
var FewdLogger = require('./lib/fewd-logger');
var FewdCommand = require('./lib/fewd-command');
// var FewdTask = require('./lib/fewd-task');
// var FewdBatch = require('./lib/fewd-batch');

/** Base class for the FEWD Toolkit. */
class Fewd {
  /**
   * creates an instance of the FEWD toolkit
   * @param {object} - the configuration JSON for FEWD toolkit
   */
  constructor(config) {
    this.config = config;
  }

  /**
   * finds a property on the configuration object passed
   * @param {object} configObj - the configuration object to search
   * @param {string} prop - the key to search for
   * @returns value of a property in the configObj
   */
  getConfigProperty(configObj, prop) {
    if(typeof prop === 'string') {
      if(configObj.hasOwnProperty(prop)) {
        return configObj[prop];
      } else {
        this.logger.info("No configuration key found for `" + prop + "`.");
      }
    } else {
      this.logger.error("Error: invalid property when getting config.");
    }
    return false;
  }

  /**
   * gets a configuration property based on a variable number of arguments
   * @param {Array} arguments - arguments are a list of strings, in order,
   *  to retrieve from the configuration object.
   * @returns the value of the configuration item specified, or false if the
   *  configurtion was not found.
   */
  getConfig() {
    var args = Array.from(arguments);
    var config = this.config;
    for(var i = 0; i < args.length; i++) {
      if(typeof config === 'object') {
        config = this.getConfigProperty(config, args[i]);
      }
    }
    return config;
  }

  /**
   * loads an npm module using require
   * @param {string} moduleName - the module name, or the path to load using
   *  require.
   * @returns the module that was loaded, or false if there is an error.
   */
  loadModule(moduleName) {
    let failError = false;
    let mod = false;
    try {
      mod = require(moduleName);
    } catch (_error) {
      failError = _error;
    } finally {
      if(failError) {
        this.log("Error loading '" + moduleName + "'.", failError);
        return false;
      }
      return mod;
    }
  }

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
