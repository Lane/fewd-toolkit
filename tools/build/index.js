
/*jslint node: true */
/*jslint esversion: 6 */

'use strict';

let Fewd = null;
let runSequence = require('run-sequence');
let gulp = require('gulp');
let FewdCommand = require('../../lib/fewd-command');

/**
 * FEWD command
 * @return {object}
 * {
 *  name: "build",
 *  description: "description",
 *  action: function
 *  cli: array
 * }
 */

/** Class for the build command for FEWD toolkit */
class FewdTaskCommand extends FewdCommand {
  /**
   * create the build command
   * @param {Fewd} Fewd - instance of Fewd to add the command to
   */
  constructor(FewdInst, name, description, options) {
    this.config = Fewd.getConfig(name);
    this.configItems = Fewd.getConfig(name, "items");
    this.Fewd = Fewd = FewdInst;
    this.runner = gulp;

    this.sequence = runSequence.use(this.runner);
  }

  /**
   * gets the configuration object for the build item in config.build.items
   * @param {string} itemName - the name of the build item
   * @return {object} - the configuration object for the item
   */
  getConfigItem(itemName) {
    this.configItems.forEach( (item) => {
      if(item.name === itemName) { return item; }
    });
    return false;
  }

  createTask(item) {
    let handler, handlerName;
    let failed = false;
    if(item.handler) {
      handlerName = item.handler;
    } else {
      handlerName = "./tasks/" + item.name;
    }
    handler = this.Fewd.loadModule(handlerName);
    if(handler) {
      // create the task item
      let taskItem = (new this.Fewd.Task(item.name, item, this.Fewd));
      taskItem.addHandler(handler);
      return taskItem;
    }
    return false;
  }

  buildTaskList() {
    this.configItems.forEach( (item) => {
      let buildTask = this.createTask(item);
      if(buildTask) {
        this.taskList.push(buildTask);
      }
    });
    return this.taskList;
  }

  getTaskNameList() {
    let taskNames = [];
    this.taskList.forEach( (task) => {
      taskNames.push(task.getName());
    });
    return taskNames;
  }



  runTasks() {

  }

  /**
   * build action for the build command
   */
  run() {
    let buildTasks = this.buildTaskList();
    return this.runTasks(this.getTaskNameList());
  }
}

//
// var buildFunction = function (Fewd) {
//
//   // var buildConfig = Fewd.getConfig("build");
//   // var buildItemsConfig = Fewd.getConfig("build", "items");
//   //
//   // // TODO: move to task
//   // var isBatch = function(taskConfig) {
//   //   if(taskConfig.hasOwnProperty("items")) {
//   //     return true;
//   //   }
//   // };
//   //
//   //
//   // var getConfigItem = function(itemName) {
//   //   for(var i = 0; i < buildItemsConfig.length; i++) {
//   //     if(buildItemsConfig[i].name === itemName) {
//   //       return buildItemsConfig[i];
//   //     }
//   //   }
//   //   return false;
//   // };
//
//
//   // combines the `src` parameter of all of the batches
//   // for the watch task
//   // var getSourceFiles = function(task) {
//   //   var i, item, len, sources;
//   //   var taskConfig = getConfigItem(task);
//   //   sources = [];
//   //   if (isBatch(taskConfig)) {
//   //     for (i = 0, len = taskConfig.length; i < len; i++) {
//   //       item = taskConfig[i];
//   //       if (item.hasOwnProperty("src")) {
//   //         // an array of batch objects
//   //         sources = union(sources, item.src);
//   //       } else {
//   //         logger.error("Error: Missing `src` in configuration.", item);
//   //       }
//   //     }
//   //   } else {
//   //     return taskConfig.src;
//   //   }
//   //   return sources;
//   // };
//
//   // gets the FEWD build function for the provided `taskName`
//   var getBuildFunction = function(taskName) {
//     var itemConfig = getConfigItem(taskName);
//     if (itemConfig) {
//       var FewdTask = require('./tasks/fewd-build-' + taskName);
//       var taskItem = (new Fewd.Task(taskName, itemConfig, Fewd));
//       // taskItem.src = getSourceFiles(taskName);
//       return taskItem;
//     } else {
//       logger.error("Error: Could not find config for `" + taskName + "`.");
//     }
//     return null;
//   };
//
//   // returns an array
//   // [0] - an array of task names (string) in the build
//   // [1] - an array of the build functions for each task in [0]
//   var getBuildItems = function(items) {
//     // create task list array
//     var buildItems, e, i, invalid, j, key, len, len1, removeTask, task, taskList;
//     taskList = [];
//     var buildItemsConfig = Fewd.getConfig("build", "items");
//     if(items) {
//       buildItemsConfig.forEach(function(itemConfig){
//         if(items.indexOf(itemConfig.name) > -1) {
//           taskList.push(itemConfig.name);
//         }
//       });
//     } else {
//       buildItemsConfig.forEach(function(itemConfig){
//         taskList.push(itemConfig.name);
//       });
//     }
//     // create build functions array
//     buildItems = [];
//     invalid = [];
//     for (i = 0, len = taskList.length; i < len; i++) {
//       task = taskList[i];
//       try {
//         var build = getBuildFunction(task);
//         if (build) {
//           logger.info(task + ": preparing build task");
//           buildItems.push(build);
//         } else {
//           logger.warn(task + ": no sources, skipping build");
//           invalid.push(task);
//         }
//       } catch (_error) {
//         e = _error;
//         invalid.push(task);
//         logger.error(task + ": " + e);
//       }
//     }
//     for (j = 0, len1 = invalid.length; j < len1; j++) {
//       removeTask = invalid[j];
//       taskList.splice(taskList.indexOf(removeTask), 1);
//     }
//     return [taskList, buildItems];
//   };
//
//   // watches build sources and performs build functions on changes
//   // starts browser sync and watches for changes in the build directory
//   var startDev = function(watchItems) {
//     var i, item, len, results;
//     var browserSync = require('browser-sync');
//     var buildWatch = require('./utils/watch');
//     var bsConfig = Fewd.getConfig("build", "config", "browser-sync");
//     browserSync.init(bsConfig.watch, bsConfig);
//     results = [];
//     for (i = 0, len = watchItems.length; i < len; i++) {
//       item = watchItems[i];
//       results.push(buildWatch(item.src, item.build, Fewd.config));
//     }
//     return results;
//   };
//
//   // build action for the build command
//   var build = function() {
//     var buildList;
//     buildList = getBuildItems();
//     return Fewd.runTasks(buildList[0], function() {
//       return startDev(buildList[1]);
//     });
//   };

  var buildCommand = Fewd.addCommand(
    "build <item> [otherItems...]",
    "performs a build of all source code",
    build,
    [
      {
        flags: "-d, --develop",
        description: "starts a local server, watches files for changes after build"
      },
      {
        flags: "-r, --release",
        description: "performs the build with minification"
      },
      {
        flags: "-m, --minify",
        description: "concatenate and minify source files"
      },
      {
        flags: "-o, --optimize",
        description: "optimize the images during the build"
      },
      {
        flags: "-c, --clean",
        description: "clears build directories before performing the build"
      }
    ]
  );

  // function(action, otherActions, options) {
  //   console.log("BUILD IT NOW", options);
  // };

  return buildCommand;

};

module.exports = buildFunction;
