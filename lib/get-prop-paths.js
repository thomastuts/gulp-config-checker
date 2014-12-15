'use strict';

function generatePropPaths(obj) {
  var propPaths = [];

  for (var prop in obj) {
    if (typeof obj[prop] === 'object') {
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

module.exports = generatePropPaths;
