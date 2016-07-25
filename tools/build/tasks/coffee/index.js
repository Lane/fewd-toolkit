/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

let coffee = require('gulp-coffee');
let concat = require('gulp-concat');
let gulpif = require('gulp-if');
let coffeelint = require('gulp-coffeelint');
let uglify = require('gulp-uglify');
let FewdTask = require('../../../../index.js').FewdTask;

// TODO:
// let FewdTask = require('fewd').Task

class CoffeeTask extends FewdTask {
  handleBatch(batch) {
    super.handleBatch(batch);
    batch.stream = batch.stream
      .pipe(gulpif(batch.data.config.lint, coffeelint(batch.data.config.lint)))
      .pipe(gulpif(batch.data.config.lint, coffeelint.reporter()))
      .pipe(coffee(batch.data.options))
      .pipe(gulpif(batch.data.file, concat(batch.data.file || "app.js")))
      .pipe(gulpif(batch.data.config.uglify, uglify(batch.data.config.uglify)));
    return batch;
  }
}

module.exports = CoffeeTask;
