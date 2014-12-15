'use strict';

var parserErrors = require('./errors').parser;

function templateError(error, path) {
  return error.replace('%path%', path);
}

module.exports = function (prop, path) {
  if (prop === undefined) {
    return templateError(parserErrors.PROP_UNDEFINED, path);
  }

  if (prop === '') {
    return templateError(parserErrors.PROP_EMPTY, path);
  }
}
