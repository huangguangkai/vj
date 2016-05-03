'use strict';

const ABSTRACT = require('sequelize').ABSTRACT;
const util     = require('util');

var TIMESTAMP = function ( options ) {
  if ( !(this instanceof TIMESTAMP) ) {
    return new TIMESTAMP(options);
  }

  this._options = options || {};
};

util.inherits(TIMESTAMP, ABSTRACT);


TIMESTAMP.prototype.key = TIMESTAMP.key = 'TIMESTAMP';

TIMESTAMP.prototype.toSql = function () {
  let defaultSql = 'TIMESTAMP';
  if ( this._options && this._options.allowNull ) {
    if ( !this._options.default ) {
      defaultSql += " NULL DEFAULT NULL";
    } else {
      defaultSql += ' DEFAULT CURRENT_TIMESTAMP';
    }
  }

  if ( this._options && !this._options.allowNull ) {
    defaultSql += ' DEFAULT CURRENT_TIMESTAMP NOT NULL';
  }

  if ( this._options && this._options.onUpdate ) {
    // onUpdate logic here:
  }

  return defaultSql;
};


exports.TIMESTAMP = TIMESTAMP;
