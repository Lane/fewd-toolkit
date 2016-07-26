/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

/** Class that represents a batch within a task */
class FewdBatch {
  /**
   * Create the batch.
   * @param {Gulp} gulp - instance of gulp to use for the batch
   * @param {object} batchData - configuration data for the batch
   */
  constructor(gulp, batchData) {
    this.config = batchData;
    this.stream = gulp.src(batchData.src);
  }

  /**
   * Get the config.
   * @return batch configuration object
   */
  getConfig() {
    return this.config;
  }

  /**
   * Get the stream.
   * @return gulp stream
   */
  getStream() {
    return this.stream;
  }
}

module.exports = FewdBatch;
