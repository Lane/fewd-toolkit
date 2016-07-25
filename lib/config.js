/*jslint node: true */
'use strict';

var logger = require('./fewd-logger');
var chalk = require('chalk');

process.env.INIT_CWD = process.cwd();
try {
    var config = require(process.env.INIT_CWD + "/fewd.json");
} catch (e) {
    logger.log(chalk.red(e));
    process.exit(1);
}

module.exports = config;
