'use strict';

const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const debug = require('debug')('models');
const Sequelize = require('sequelize');

const config = require('../../config');

const db = {};

const mysqlConf   = config.mysql;
const dbconn      = `mysql://${mysqlConf.user}:${mysqlConf.password}@${mysqlConf.host}:${mysqlConf.port}/${mysqlConf.database}`;
debug(dbconn);

const sequelize   = new Sequelize(dbconn, config.seq_options);

fs.readdirSync(__dirname).filter(function ( file ) {
  return (file.indexOf('.') !== 0) && (file !== 'index.js');
}).forEach(function ( file ) {
  const modelPath = path.join(__dirname, file);
  const model = sequelize['import'](modelPath);
  db[model.name] = model;
});

// 建立模型之间的关联 [注意 不要将两个数据库的表 关联]
Object.keys(db).forEach(function ( modelName ) {
  if ( 'associate' in db[modelName] ) {
    db[modelName].associate(db);
  }
});

db.sequelize   = sequelize;
db.Sequelize   = Sequelize;

module.exports = db;
