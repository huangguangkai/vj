'use strict';

const customDataTypes = require('../libs/sequelize-mysql-timestamp');

module.exports = {
  up: function ( queryInterface, Sequelize ) {
    return queryInterface.createTable('photo_packages', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        comment: 'ID'
      },
      category_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        comment: '分类ID'
      },
      category_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: '',
        charset: 'utf8mb4',
        comment: '分类名'
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: '',
        charset: 'utf8mb4',
        comment: '套餐名'
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
        comment: '套餐详情'
      },
      description_url: {
        type: Sequelize.STRING(500),
        allowNull: false,
        defaultValue: '',
        comment: '套餐详情图片介绍链接'
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
      tableName: 'photo_packages',
      comment: '照片套餐表',
      timestamps: false,
      underscored: true,
    });
  },

  down: function ( queryInterface, Sequelize ) {
    return queryInterface.dropTable('photo_packages');
  }
};
