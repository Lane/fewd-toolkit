// fewd-init
// --
// handles creating the fewd.json file for the project

var config = require(process.env.INIT_CWD+"/fewd.json");
var program = require('commander');
var gulp = require('gulp');

var fewd = require('../index.js');

program
  .option('-f, --force', 'force installation')
  .parse(process.argv);

var pkgs = program.args;

var getSourceFiles = function(task) {
  var i, item, len, ref, sources;
  sources = [];
  if (config.source[task].length > 0) {
    ref = config.source[task];
    for (i = 0, len = ref.length; i < len; i++) {
      item = ref[i];
      if (item.hasOwnProperty("src")) {
        // an array of batch objects
        sources = union(sources, item.src);
      } else {
        // an array of strings, just return
        return config.source[task];
      }
    }
  }
  return sources;
};

var getBuildFunction = function(taskName) {
  if (config.source.hasOwnProperty(taskName)) {
    if (config.source[taskName].length > 0) {
      return {
        name: taskName,
        src: getSourceFiles( taskName ),
        build: require('./tasks/' + taskName)(gulp, config)
      };
    }
  }
  return null;
};

var getBuildItems = function() {
  var build, buildItems, e, i, invalid, j, key, len, len1, removeTask, task, taskList;
  taskList = [];
  for (key in config.source) {
    taskList.push(key);
  }
  buildItems = [];
  invalid = [];
  for (i = 0, len = taskList.length; i < len; i++) {
    task = taskList[i];
    try {
      if ((build = getBuildFunction(task))) {
        logger.info(task + ": preparing build task");
        buildItems.push(build);
      } else {
        logger.warn(task + ": no sources, skipping build");
        invalid.push(task);
      }
    } catch (_error) {
      e = _error;
      invalid.push(task);
      logger.error(task + ": " + e);
    }
  }
  for (j = 0, len1 = invalid.length; j < len1; j++) {
    removeTask = invalid[j];
    taskList.splice(taskList.indexOf(removeTask), 1);
  }
  return [taskList, buildItems];
};


var startDev = function(watchItems) {
  var browserSync, buildWatch, i, item, len, results;
  browserSync = require('browser-sync');
  browserSync.init(config.target.sync, config.browserSync);
  buildWatch = require('./utils/watch');
  results = [];
  for (i = 0, len = watchItems.length; i < len; i++) {
    item = watchItems[i];
    results.push(buildWatch(item.src, item.build, config));
  }
  return results;
};

var build = function(env, options) {
  var buildList, runSequence;
  config = processConfig(config);
  runSequence = require('run-sequence').use(gulp);
  config.flags.watch = true;
  config.flags.debug = true;
  buildList = getBuildItems();
  return runSequence(buildList[0], function() {
    return startDev(buildList[1]);
  });
};

// actions here
