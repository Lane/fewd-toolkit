/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

var FewdCommand = require('./fewd-command');
let FewdItem = require('./fewd-item');
var argv = require('minimist')(process.argv.slice(2));

/** Base class for the FEWD command line interface. */
class FewdCli extends FewdItem {

  constructor(config) {
    // get item in argv
    super(null, "fewd", "fewd-command", config.items, config);
  }

  run() {

  }

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
FewdCli.prototype.Command = FewdCommand;

// export a function that creates a new instance of Fewd.
module.exports = function (config) {
  return (new FewdCli(config));
};
