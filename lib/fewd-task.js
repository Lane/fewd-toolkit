/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

let plumber = require('gulp-plumber');
let size = require('gulp-size');
let mergeStream = require('merge-stream');
let logger = require('../../../lib/fewd-logger');
let FewdBatch = require('../../../lib/fewd-batch');

/** Class that represents a task that will use gulp */
class FewdTask {
  /**
   * Create the task.
   * @param {string} taskName - the name that will be used for the gulp task
   * @param {object} taskConfig - the configuration object for the task
   * @param {Fewd} Fewd - the FEWD instance that this task will be added to
   */
  constructor(taskName, taskConfig, Fewd) {

    // define properties
    this.gulp = Fewd.getGulp();
    this.taskName = taskName;
    this.taskConfig = taskConfig;
    this.appConfig = Fewd.getConfig();
    this.batchCollection = [];
    this.batchHandlers = [];

    // create the gulp task
    this.gulp.task(this.taskName, this.build);

    // add the batches in the configuration
    if (this.taskConfig.items) {
      this.taskConfig.items.forEach( (item) => {
        this.batchCollection.push(new FewdBatch(this.gulp, item));
      });
    }
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
      this.gulp.dest(batch.getConfig().dst)
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
//
// function FewdTask(taskName, itemConfig, Fewd) {
//   var batch, i, len, ref;
//   this.gulp = Fewd.useGulp();
//   this.taskName = taskName;
//   this.taskData = itemConfig;
//   this.appConfig = Fewd.getConfig();
//   logger.debug(this.taskName + ": constructing");
//   this.batchCollection = [];
//   this.gulp.task(this.taskName, this.build);
//   if (this.taskData.batches) {
//     ref = this.taskData.batches;
//     for (i = 0, len = ref.length; i < len; i++) {
//       batch = ref[i];
//       this.batchCollection.push({
//         data: batch,
//         stream: createBatchStream(this.gulp, batch)
//       });
//     }
//   }
// }
//
// FewdTask.prototype.finishBatch = function(batch) {
//   return batch.stream.pipe(size({
//     "title": this.taskName
//   })).pipe(
//     this.gulp.dest(batch.data.dst)
//   );
// };
//
// FewdTask.prototype.handleBatch = function(batch) {
//   logger.debug(this.taskName + ": handling batch");
//   return batch;
// };
//
// FewdTask.prototype.build = function() {
//   var batch, e, fullStream, i, len, ref, streams;
//   if (this.taskName) {
//     logger.debug(this.taskName + ": building");
//     streams = mergeStream();
//     try {
//       ref = this.batchCollection;
//       for (i = 0, len = ref.length; i < len; i++) {
//         batch = ref[i];
//         batch = this.handleBatch(batch);
//         fullStream = this.finishBatch(batch);
//         streams.add(fullStream);
//       }
//     } catch (_error) {
//       e = _error;
//       logger.error(this.taskName + ": " + e);
//     }
//     return streams;
//   }
// };

module.exports = FewdTask;
