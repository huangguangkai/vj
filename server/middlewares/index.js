'use strict';

const _    = require('lodash');
const path = require('path');
const fs   = require('fs');

fs.readdirSync(__dirname).filter(function ( file ) {
  return (file.indexOf('.') !== 0) && (_.endsWith(file, '.js')) && (file !== 'index.js');
}).forEach(function ( file ) {
  var name      = _.camelCase(path.basename(file, '.js'));
  exports[name] = require('./' + file);
});
