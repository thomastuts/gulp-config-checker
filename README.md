gulp-config-checker
===================

Checks a config against a configuration template, and warns you of any missing properties that should be there.

### Quick overview

As an example, in your codebase you would have a file called `config.base.js`

```json
// config.base.json

{
  "apiUrl": "",
  "apiKey": "",
  "environment": ""
}
```

You also have a `config.js` file which contains all the sensitive data, and is not committed in your VCS. This config file basically mirrors the template:

```json
// config.json

{
  "apiUrl": "http://api.example.com",
  "apiKey": "",
  "environment": "development"
}
```

Now, the problem with not having this file in the VCS is that the implementation of this config usually needs to be an (almost) exact match (property-wise) to the configuration template above, otherwise you might get a bunch of errors in your application. 

However, the real issue is with keeping it up-to-date, and verifying that configs work like they should. This is where `gulp-config-checker` comes in - it compares your configuration file with the configuration template, and warns you of any errors that could occur. In the above file, we conveniently forgot to fill in the `apiKey` property. Let's see how we can track this down using `gulp-config-checker`.

**This plugin only parses JSON-like configuration files. If you have a JS configuration object and would like to check it, you'll need to [transform](#transforms) it first (example given below)**

### How to use it

1. Make sure you have a config template and a configuration like illustrated above
2. Install the plugin: `npm install --save-dev gulp-config-checker`
3. Add the Gulp task:

```js
var gulp = require('gulp');
var configChecker = require('./index');

gulp.task('check-config', function () {
  return gulp.src('config.json') // the filled in configuration file
    .pipe(configChecker({
      template: 'config.base.json' // the configuration template
    }));
});
```
3. Run the gulp task in terminal: `gulp check-config`
4. This will result in the following output:

```
$ gulp check-config
[16:48:51] Starting 'check-config'...
[16:48:51] 'check-config' errored after 11 ms
[16:48:51] Error in plugin 'gulp-config-checker'
Message:
    The `apiKey` property is empty
```

**If an error is found, the task exists with an exit code of `1`, this allows you to end your build processes prematurely so you can fix things.**

### API

The plugin can be customized with specified options passed into the plugin during your task.

#### `options.template` (String)
**Required.** This is the path to your config's template. This is the file that the plugin will check the configuration against.

#### `ignoredPaths` (Array)
Ignores a property using the path specified. Any child properties will also be ignored.

#### `transforms.template` and `transforms.config`
These are two methods that take in the file's contents, which you can then alter and send back to the plugin for processing. The plugin expects a JSON string, which is then internally parsed as JSON.

### <a name="transforms"></a> Transforming configuration files
Sometimes, you don't have a JSON file for configuration, but a JS file with a JSON-like object. For example:


```js
// config.base.js

var CONFIG = {
  "apiUrl": "",
  "apiKey": "",
  "environment": ""
};
```

```js
// config.js

var CONFIG = {
  "apiUrl": "http://api.example.com",
  "apiKey": "",
  "environment": "development"
};
```

These files are read as a string and then parsed as JSON. Needless to say, the JSON parsing would fail in this case. That's where the transforms come in. You can remove the extra JS syntax by replacing things in the string. This will ensure that we get a proper JSON string which can then be used to check the configuration. Feel free to use whatever trickery you can think of to convert your configuration to JSON, as long as you return a JSON string the plugin will be happy.

```js
gulp.task('check-config', function () {
  return gulp.src('config.json')
    .pipe(configChecker({
      template: 'config.base.js',
      transforms: {
        template: function (file) {
          file = file.replace('var CONFIG = ', '').replace(';', '');
          return file;
        },
        config: function (file) {
          file = file.replace('var CONFIG = ', '').replace(';', '');
          return file;
        }
      }
    }));
});
```

