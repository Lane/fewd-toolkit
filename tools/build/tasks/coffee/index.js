/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

let coffee = require('gulp-coffee');
let concat = require('gulp-concat');
let gulpif = require('gulp-if');
let coffeelint = require('gulp-coffeelint');
let uglify = require('gulp-uglify');

let schema = {
  items: [
    {
      key: "config",
      type: "object",
      items: [
        {
          key: "lint",
          name: "Coffeelint Config",
          type: "json",
          reference: "http://www.coffeelint.org/#options"
        },
        {
          key: "coffee",
          name: "Coffee Transpiler Config",
          type: "json",
          reference: "https://www.npmjs.com/package/gulp-coffee"
        },
        {
          key: "uglify",
          name: "Uglify Config",
          type: "json",
          reference: "https://www.npmjs.com/package/gulp-uglify"
        }
      ]
    },
    {
      key: "items",
      type: "objectCollection",
      items: [
        {
          key: "src",
          label: "Source files",
          type: "stringCollection"
        },
        {
          key: "dst",
          label: "Output destination",
          type: "stringCollection"
        }
      ]
    }
  ]
};

/**
 * handler function for a batch of coffee
 * @return the modified batch
 */
module.exports = function(batch) {
  let gulpStream = batch.getStream();
  let batchConfig = batch.getConfig();
  gulpStream = gulpStream
    .pipe(gulpif(batchConfig.config.lint, coffeelint(batchConfig.config.lint)))
    .pipe(gulpif(batchConfig.config.lint, coffeelint.reporter()))
    .pipe(coffee(batchConfig.config.coffee))
    .pipe(gulpif(batchConfig.file, concat(batchConfig.file || "app.js")))
    .pipe(gulpif(batchConfig.config.uglify, uglify(batchConfig.config.uglify)));
  return batch;
};
