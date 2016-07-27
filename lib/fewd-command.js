/*jslint node: true */
/*jslint esversion: 6 */

'use strict';

/** Class representing a CLI command for FEWD Toolkit */
class FewdCommand {
  /**
   * creates a CLI command
   * @param {Fewd} fewd - the FEWD instance to add the command to
   */
  constructor(name, description, options) {
    this.actions = [];
    this.before = [];
    this.after = [];
    this.name = name || "";
    this.description = description || "";
    this.options = options || [];
  }

  /**
   * Sets the name for the command
   * @param {string} name - the name of the command
   */
  setName(name) { this.name = name; }

  /**
   * Sets the description for the command
   * @param {string} desc - the description of the command
   */
  setDescription(desc) { this.description = desc; }

  /**
   * Adds a function to run before the actions
   * @param {function} func - the function to run before the actions
   */
  beforeRun(func) { this.before.push(func); }

  /**
   * Adds a function to run after the actions
   * @param {function} func - the function to run after the actions
   */
  afterRun(func) { this.after.push(func); }

  /**
   * Adds an action function to run when the command is executes
   * @param {function} func - the function to run
   */
  addAction(func) { this.actions.push(func); }

  /**
   * Adds an option to the command
   * @param {string} flags - the flags for the option
   * @param {string} description - description of what the flag represents
   */
  addOption(flags, description) {
    this.options.push({
      flags: flags,
      description: description
    });
    return this;
  }

  /**
   * Adds the command to the FEWD Toolkit
   */
  addToInstance( Fewd ) {
    this.Fewd = Fewd;
    this.config = Fewd.getConfig(this.name);
    if (Fewd.getCLI()) {
      let program = Fewd.getCLI();
      program
        .command(this.name)
        .description(this.description);
      this.options.forEach(function(o) {
        program.option(o.flags, o.description);
      });
      program.action(this.run.bind(this));
    } else {
      Fewd.log.error(
        "ERROR: Cannot add a command without a commander instance."
      );
    }
  }

  /**
   * Runs the before actions for the command
   */
  runBefore() {
    this.before.forEach( (action) => {
      action(this);
    });
  }

  /**
   * Runs the actions for the command
   */
  runActions() {
    this.actions.forEach( (action) => {
      action(this);
    });
  }

  /**
   * Runs the after actions for the command
   */
  runAfter() {
    this.after.forEach( (action) => {
      action(this);
    });
  }

  /**
   * Runs the command
   */
  run() {
    this.runBefore();
    this.runActions();
    this.runAfter();
  }
}

module.exports = FewdCommand;
