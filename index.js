/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

let Fewd = require('./lib/fewd-cli');

// export a function that creates a new instance of Fewd.
module.exports = function (config) {
  return (new Fewd(config));
};
