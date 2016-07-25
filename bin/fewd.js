#!/usr/bin/env node
/*jslint node: true */
/*jslint white: true */
'use strict';

var chalk = require('chalk');
var program = require('commander');
var Fewd = require('../index.js');
var logger = require('../lib/fewd-logger.js');
var config = require('../lib/config.js');

var prefix = "../tools/";

var getCommand = function (name, instance) {
  var build = require("fewd-" + name);
  return build(instance);
};

var fewdInst = Fewd( config );

// initialize program
program
  .version('0.0.1')
  .command('init', 'initialize a project to use with the fewd toolkit');
fewdInst.setCommander(program);

// default tools
var fewdTools = [ "name", "build", "deploy", "docs", "test", "app" ];


// add any custom commands
// for ( var key in config ) {
//   if( fewdTools.indexOf( key ) < 0 ) {
//     var command = getCommand( key, fewdInst );
//     fewdInst.addCommand( command );
//   }
// }
var buildCommand = require( prefix + "build" )(fewdInst);

program.parse(process.argv);

// // Exit with 0 or 1
// var failed = false;
// process.once('exit', function(code) {
//   if (code === 0 && failed) {
//     process.exit(1);
//   }
// });

// // The actual logic
// function handleArguments(env) {
//   if (versionFlag && tasks.length === 0) {
//     if (env.modulePackage && typeof env.modulePackage.version !== 'undefined') {
//       gutil.log('Local version', env.modulePackage.version);
//     }
//     process.exit(0);
//   }
//
//   if (!env.modulePath) {
//     gutil.log(
//       chalk.red('Local gulp not found in'),
//       chalk.magenta(tildify(env.cwd))
//     );
//     gutil.log(chalk.red('Try running: npm install gulp'));
//     process.exit(1);
//   }
//
//   if (!env.configPath) {
//     gutil.log(chalk.red('No gulpfile found'));
//     process.exit(1);
//   }
//
//   // Chdir before requiring gulpfile to make sure
//   // we let them chdir as needed
//   if (process.cwd() !== env.cwd) {
//     process.chdir(env.cwd);
//     gutil.log(
//       'Working directory changed to',
//       chalk.magenta(tildify(env.cwd))
//     );
//   }
//
//   // This is what actually loads up the gulpfile
//   require(env.configPath);
//   gutil.log('Using gulpfile', chalk.magenta(tildify(env.configPath)));
//
//   var gulpInst = require(env.modulePath);
//   logEvents(gulpInst);
//
//   process.nextTick(function() {
//     if (simpleTasksFlag) {
//       return logTasksSimple(env, gulpInst);
//     }
//     if (tasksFlag) {
//       return logTasks(env, gulpInst);
//     }
//     gulpInst.start.apply(gulpInst, toRun);
//   });
// }
//
// function logTasks(env, localGulp) {
//   var tree = taskTree(localGulp.tasks);
//   tree.label = 'Tasks for ' + chalk.magenta(tildify(env.configPath));
//   archy(tree)
//     .split('\n')
//     .forEach(function(v) {
//       if (v.trim().length === 0) {
//         return;
//       }
//       gutil.log(v);
//     });
// }
//
// function logTasksSimple(env, localGulp) {
//   console.log(Object.keys(localGulp.tasks)
//     .join('\n')
//     .trim());
// }
//
// // Format orchestrator errors
// function formatError(e) {
//   if (!e.err) {
//     return e.message;
//   }
//
//   // PluginError
//   if (typeof e.err.showStack === 'boolean') {
//     return e.err.toString();
//   }
//
//   // Normal error
//   if (e.err.stack) {
//     return e.err.stack;
//   }
//
//   // Unknown (string, number, etc.)
//   return new Error(String(e.err)).stack;
// }
//
// // Wire up logging events
// function logEvents(gulpInst) {
//
//   // Total hack due to poor error management in orchestrator
//   gulpInst.on('err', function() {
//     failed = true;
//   });
//
//   gulpInst.on('task_start', function(e) {
//     // TODO: batch these
//     // so when 5 tasks start at once it only logs one time with all 5
//     gutil.log('Starting', '\'' + chalk.cyan(e.task) + '\'...');
//   });
//
//   gulpInst.on('task_stop', function(e) {
//     var time = prettyTime(e.hrDuration);
//     gutil.log(
//       'Finished', '\'' + chalk.cyan(e.task) + '\'',
//       'after', chalk.magenta(time)
//     );
//   });
//
//   gulpInst.on('task_err', function(e) {
//     var msg = formatError(e);
//     var time = prettyTime(e.hrDuration);
//     gutil.log(
//       '\'' + chalk.cyan(e.task) + '\'',
//       chalk.red('errored after'),
//       chalk.magenta(time)
//     );
//     gutil.log(msg);
//   });
//
//   gulpInst.on('task_not_found', function(err) {
//     gutil.log(
//       chalk.red('Task \'' + err.task + '\' is not in your gulpfile')
//     );
//     gutil.log('Please check the documentation for proper gulpfile formatting');
//     process.exit(1);
//   });
// }
