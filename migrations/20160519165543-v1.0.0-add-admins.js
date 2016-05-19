'use strict';

const customDataTypes = require('../libs/sequelize-mysql-timestamp');

module.exports = {
  up: function ( queryInterface, Sequelize ) {
    return queryInterface.createTable('admins', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: Sequelize.STRING,
      salt: Sequelize.STRING, // 密码盐
      hashed_password: Sequelize.STRING,
      nickname: Sequelize.STRING,

      created_at: {
        type: customDataTypes.TIMESTAMP,
        defaultValue: Sequelize.NOW
      }
    }, {
      tableName: 'admins',
      comment: '管理员表',
      timestamps: false,
      underscored: true,
    });
  },

  down: function ( queryInterface, Sequelize ) {
    return queryInterface.dropTable('admins');
  }
};
