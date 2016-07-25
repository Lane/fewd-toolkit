/*jslint node: true */
/*jslint esversion: 6 */

'use strict';

var logger = require('./fewd-logger');

class FewdCommand {
  constructor(fewd, name, description, action, options) {
    this.fewd = fewd;
    this.config = fewd.getConfig(name.split(" ")[0]);
    this.action = action;
    this.name = name || "";
    this.description = description || "";
    this.options = options || [];
    var _this = this;
    if (_this.fewd.isCommanderSet()) {
      _this.fewd.program
        .command(_this.name)
        .description(_this.description);
      _this.options.forEach(function(o) {
        _this.fewd.program.option(o.flags, o.description);
      });
      _this.fewd.program.action(_this.action);
    } else {
      logger.error("ERROR: Cannot add a command without a commander instance.");
    }
  }
}

module.exports = FewdCommand;
