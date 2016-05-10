'use strict';

const customDataTypes = require('../libs/sequelize-mysql-timestamp');

module.exports = {
  up: function ( queryInterface, Sequelize ) {
    return queryInterface.createTable('staffs', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        comment: 'ID'
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: '',
        charset: 'utf8mb4',
        comment: '名称'
      },
      url: {
        type: Sequelize.STRING(500),
        allowNull: false,
        defaultValue: '',
        comment: '链接地址'
      },
      cover_url: {
        type: Sequelize.STRING(500),
        allowNull: false,
        defaultValue: '',
        comment: '封面图片地址'
      },
      index: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: '权重'
      },
      created_at: {
        type: customDataTypes.TIMESTAMP,
        defaultValue: Sequelize.NOW,
        comment: '创建时间'
      },
      updated_at: {
        type: customDataTypes.TIMESTAMP,
        defaultValue: Sequelize.NOW,
        comment: '更新时间'
      }
    }, {
      tableName: 'staffs',
      comment: '人员表',
      timestamps: false,
      underscored: true,
    });
  },

  down: function ( queryInterface, Sequelize ) {
    return queryInterface.dropTable('staffs');
  }
};
