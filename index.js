'use strict';

var gutil = require('gulp-util');
var through = require('through2');
var assign = require('object-assign');

/**
 *
 * Expected result:
 * error: fruitCount.banana is missing
 * warning: veggies is empty
 *
 * options:
 * throw on warning
 * transformer for config template and config (exposes file's string, expects a modified string)
 * future: optional ignored fields
 *
 */

module.exports = function (opts) {
  return through.obj(function (file, enc, cb) {

    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError('gulp-config-checker', 'Streaming not supported'));
      return;
    }

    var options = assign({}, opts);
    var filePath = file.path;

    file.contents = 'I GOT MODIFIED WOOOO';

  });
};
