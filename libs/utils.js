'use strict';

const uuid = require('node-uuid');

exports.uuid32 = function () {
  return uuid.v4().replace(/-/g, '');
};