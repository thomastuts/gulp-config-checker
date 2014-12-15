'use strict';

var gutil = require('gulp-util');
var through = require('through2');
var assign = require('object-assign');
var _ = require("lodash");
_.mixin(require("lodash-deep"));

var fs = require('fs');

/**
 *
 * Expected result:
 * error: fruitCount.banana is missing
 * warning: veggies is empty
 *
 * options:
 * template location
 * throw on warning
 * transformer for config template and config (exposes file's string, expects a modified string)
 * future: optional ignored fields
 * future: rules for properties, i.e. a number can't be greater than a value, ...
 *
 */

module.exports = function (opts) {
  return through.obj(function (configFile, enc, cb) {

    if (configFile.isNull()) {
      cb(null, configFile);
      return;
    }

    if (configFile.isStream()) {
      cb(new gutil.PluginError('gulp-config-checker', 'Streaming not supported'));
      return;
    }

    var options = assign({
      throwOnWarning: true,
      transforms: {}
    }, opts);

    var config, template;
    var errors = [];

    var configString = configFile.contents.toString();

    if (!options.template) {
      cb(new gutil.PluginError('gulp-config-checker', 'The template property is required'));
    }

    // If an optional transformer is given, transform the file before parsing it to JSON
    if (options.transforms.config) {
      config = JSON.parse(options.transforms.config(configString));
    }
    else {
      config = JSON.parse(configString)
    }

    // Read the template file
    fs.readFile(options.template, 'utf-8', function (err, template) {

      if (err) {
        return cb(new gutil.PluginError('gulp-config-checker', err.message));
      }

      // If an optional transformer is given, transform the file before parsing it to JSON
      if (options.transforms.template) {
        template = JSON.parse(options.transforms.template(template));
      }
      else {
        template = JSON.parse(template)
      }

      function parsePropForError(prop, path) {
        if (prop === undefined) {
          console.log('Error for prop:', prop);
          return 'The `' + path + '` property is undefined';
        }

        if (prop === '') {
          return 'The `' + path + '` property is empty';
        }
      }

      function generatePropPaths(obj) {
        var propPaths = [];

        for (var prop in obj) {

          if (typeof obj[prop] === 'object') {
            // Recursively loop through this object too
            var childProps = generatePropPaths(obj[prop]);

            childProps.forEach(function (childProp) {
              propPaths.push(prop + '.' + childProp);
            });
          }
          else {
            propPaths.push(prop);
          }

        }

        return propPaths;
      }

      // Generate paths for all possible config props
      var propPaths = generatePropPaths(template);

      // Loop through prop paths and parse for errors
      propPaths.forEach(function (prop) {
        var error = parsePropForError(_.deepGet(config, prop), prop);

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
