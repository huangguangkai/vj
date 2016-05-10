'use strict';

const fs = require('fs');
const path = require('path');

const CONSTANTS = {};

fs.readdirSync(__dirname).filter(function ( file ) {
  return (file.indexOf('.') !== 0) && (file !== 'index.js');
}).forEach(function ( file ) {
  const constantPath = path.join(__dirname, file);
  const name = path.basename(file, '.js').toUpperCase();
  CONSTANTS[name] = require(constantPath);
});

module.exports = CONSTANTS;
