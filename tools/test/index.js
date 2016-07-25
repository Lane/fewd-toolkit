
var testFunction = function(config) {
  var build = function(env, options) { };
  var buildCommand = {};
  buildCommand.name = "test";
  buildCommand.description = "not yet implemented";
  buildCommand.action = build;
  buildCommand.options = [];
  return buildCommand;
};

module.exports = testFunction;
