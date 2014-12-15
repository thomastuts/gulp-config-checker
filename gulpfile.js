'use strict';

var gulp = require('gulp');
var configChecker = require('./index');

gulp.task('run', function () {
  return gulp.src('test/config.json')
    .pipe(configChecker({
      template: 'test/config.base.json'
    }));
});
