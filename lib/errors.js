'use strict';

module.exports = {
  files: {
    NO_CONFIG: 'Your configuration file can\'t be read or does not exist',
    NO_TEMPLATE: 'Your configuration template can\'t be read or does not exist',
    NO_STREAM: 'Streaming is not supported',
    INVALID_JSON_TEMPLATE: 'Your template file is not a valid JSON file. Transform its contents to JSON using a transformer',
    INVALID_JSON_CONFIG: 'Your configuration file is not a valid JSON file. Transform its contents to JSON using a transformer',
    TEMPLATE_REQ: 'The template property is required'
  },
  parser: {
    PROP_UNDEFINED: 'The `%path%` property is undefined',
    PROP_EMPTY: 'The `%path%` property is empty'
  }
}
