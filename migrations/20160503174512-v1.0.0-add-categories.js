'use strict';

const customDataTypes = require('../libs/sequelize-mysql-timestamp');

module.exports = {
  up: function ( queryInterface, Sequelize ) {
    return queryInterface.createTable('photo_categories', {
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
        comment: '分类名'
      },
      cover_url: {
        type: Sequelize.STRING(500),
        allowNull: false,
        defaultValue: '',
        comment: '封面图片地址'
      },
      video_url: {
        type: Sequelize.STRING(500),
        allowNull: false,
        defaultValue: '',
        comment: '视频地址'
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
      tableName: 'photo_categories',
      comment: '照片分类表',
      timestamps: false,
      underscored: true,
    });
  },

  down: function ( queryInterface, Sequelize ) {
    return queryInterface.dropTable('photo_categories');
  }
};
