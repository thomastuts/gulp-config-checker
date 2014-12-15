'use strict';

var gutil = require('gulp-util');
var through = require('through2');
var assign = require('object-assign');
var _ = require("lodash");
_.mixin(require("lodash-deep"));

var getPropPaths = require('./lib/get-prop-paths');
var errorParser = require('./lib/error-parser');
var errors = require('./lib/errors');
var fs = require('fs');

/**
 *
 * options:
 * template location
 * throw on warning
 * transformer for config template and config (exposes file's string, expects a modified string)
 * future: optional ignored fields
 * future: rules for properties, i.e. a number can't be greater than a value, type checking, ...
 *
 */

module.exports = function (opts) {
  return through.obj(function (configFile, enc, cb) {

    var options = assign({
      throwOnWarning: true,
      transforms: {}
    }, opts);

    var config, template;
    var errors = [];

    if (configFile.isNull()) {
      cb(new gutil.PluginError('gulp-config-checker', errors.files.NO_CONFIG));
    }

    if (configFile.isStream()) {
      cb(new gutil.PluginError('gulp-config-checker', errors.files.NO_STREAM));
      return;
    }

    if (!options.template) {
      cb(new gutil.PluginError('gulp-config-checker', errors.files.TEMPLATE_REQ));
    }

    // If an optional transformer is given, transform the file before parsing it to JSON
    if (options.transforms.config) {
      config = JSON.parse(options.transforms.config(configFile.contents.toString()));
    }
    else {
      config = JSON.parse(configFile.contents.toString())
    }

    // Read the template file
    fs.readFile(options.template, 'utf-8', function (err, templateFile) {
      if (err) {
        return cb(new gutil.PluginError('gulp-config-checker', errors.files.NO_TEMPLATE));
      }

      // If an optional transformer is given, transform the file before parsing it to JSON
      if (options.transforms.template) {
        template = JSON.parse(options.transforms.template(templateFile));
      }
      else {
        template = JSON.parse(templateFile)
      }

      // Generate paths for all possible config props
      var propPaths = getPropPaths(template);

      // Loop through prop paths and parse each prop for errors
      propPaths.forEach(function (propPath) {
        var error = errorParser(_.deepGet(config, propPath), propPath);

        if (error) {
          errors.push(error);
        }
      });

      if (errors.length > 0) {
        return cb(new gutil.PluginError('gulp-config-checker', errors.join('\n'))); // TODO: prettify this output
      }
      else {
        cb();
      }
    });
  });
};
