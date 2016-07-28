
/*jslint node: true */
/*jslint esversion: 6 */

'use strict';
let runSequence = require('run-sequence');
let gulp = require('gulp');
let FewdCommand = require('./fewd-command');

/** Class for the build command for FEWD toolkit */
class FewdTaskCommand extends FewdCommand {
  /**
   * create the build command
   * @param {Fewd} Fewd - instance of Fewd to add the command to
   */
  constructor(name, description, options) {
    super(name, description, options);
    this.runner = gulp;
    this.runSequence = runSequence.use(this.runner);
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
      let taskItem = (new this.Fewd.Task(item.name, item, this));
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

  runActions() {
    let buildTasks = this.buildTaskList();
    return this.runSequence(this.getTaskNameList());
  }
}

module.exports = FewdTaskCommand;
