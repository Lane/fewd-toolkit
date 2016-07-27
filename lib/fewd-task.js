/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

let union = require('lodash.union');
let plumber = require('gulp-plumber');
let size = require('gulp-size');
let mergeStream = require('merge-stream');
let logger = require('../../../lib/fewd-logger');
// let FewdBatch = require('../../../lib/fewd-batch');

/** Class that represents a task that will use the task runner (gulp) */
class FewdTask {

  /**
   * Create the task.
   * @param {string} taskName - the name that will be used for the gulp task
   * @param {object} taskConfig - the configuration object for the task
   * @param {FewdCommand} Fewd - the FEWD instance that this task will be added to
   */
  constructor(taskName, taskConfig, FewdCommand) {

    // define properties
    this.Fewd = FewdCommand.Fewd;
    this.runner = FewdCommand.runner;
    this.taskName = taskName;
    this.taskConfig = taskConfig;
    this.appConfig = FewdCommand.Fewd.getConfig();
    this.batchCollection = [];
    this.batchHandlers = [];

    // create the gulp task
    this.runner.task(this.taskName, this.build);

    // add the batches in the configuration
    if (this.taskConfig.items) {
      this.taskConfig.items.forEach( (item) => {
        this.batchCollection.push(new this.Fewd.Batch(this.runner, item));
      });
    }
  }

  /**
   * gets the name for this task
   * @return {String} - the name of this task
   */
  getName() { return this.taskName; }

  /**
   * combines the sources of all of the batches into an array
   * @return {Array} - an array of all of the source files in the task
   */
  getSourceFiles( ) {
    let sources = [];
    this.taskConfig.items.forEach( (item) => {
      if (item.hasOwnProperty("src")) {
        // an array of batch objects
        sources = union(sources, item.src);
      } else {
        logger.error("Error: Missing `src` in configuration.", item);
      }
    });
    return sources;
  }

  /**
   * logs the name of the batch before processing
   * @param {FewdBatch} batch - the batch to pre-process
   */
  beforeProcessBatch( batch ) {
    logger.debug(this.taskName + ": handling batch");
    batch.getStream().pipe(plumber({
      errorHandler: logger.error
    }));
    return batch;
  }

  /**
   * prints out the output size of the processed batches and places them in
   * the destination folder.
   * @param {FewdBatch} batch - the batch to post-process
   */
  afterProcessBatch( batch ) {
    return batch.getStream().pipe(size({
      "title": this.taskName
    })).pipe(
      this.runner.dest(batch.getConfig().dst)
    );
  }

  /**
   * runs the batch handlers for the tasks
   * @param {FewdBatch} batch - the batch to process
   */
  processBatch( batch ) {
    batch = this.beforeProcessBatch( batch );
    this.batchHandlers.forEach( (handler) => {
      batch = handler(batch);
    });
    batch = this.afterProcessBatch( batch );
    return batch;
  }

  /**
   * adds a handler for the batch
   * @param {function} handlerFunc - the handler function for the batch
   */
  addHandler( handlerFunc ) {
    this.batchHandlers.push(handlerFunc);
  }

  /** processes all of the batches in the build */
  build() {
    if (this.taskName) {
      // stream collection
      var streams = mergeStream();
      try {
        this.batchCollection.forEach( (batch) => {
          streams.add( this.processBatch(batch) );
        });
      } catch (_error) {
        logger.error(this.taskName + ": " + _error);
      } finally {
        return streams;
      }
    }
  }
}

module.exports = FewdTask;
