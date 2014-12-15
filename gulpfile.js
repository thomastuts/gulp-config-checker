'use strict';

var gulp = require('gulp');
var configChecker = require('./index');

gulp.task('run:json', function () {
  return gulp.src('fixtures/config.json')
    .pipe(configChecker({
      template: 'fixtures/config.base.json'
    }));
});

gulp.task('run:js', function () {
  return gulp.src('fixtures/config.json')
    .pipe(configChecker({
      template: 'fixtures/config.base.js',
      transforms: {
        template: function (file) {
          file = file.replace('window.CONFIG = ', '').replace(';', '');
          return file;
        },
        config: function (file) {
          file = file.replace('window.CONFIG = ', '').replace(';', '');
          return file;
        }
      }
    }));
});
