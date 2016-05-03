'use strict';

const customDataTypes = require('../libs/sequelize-mysql-timestamp');

module.exports = {
  up: function ( queryInterface, Sequelize ) {
    return queryInterface.createTable('photos', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        comment: 'ID'
      },
      category_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: '分类ID'
      },
      category_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: '',
        charset: 'utf8mb4',
        comment: '分类名'
      },
      package_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: '套餐ID'
      },
      package_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: '',
        charset: 'utf8mb4',
        comment: '套餐名'
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: '',
        charset: 'utf8mb4',
        comment: '照片名'
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
        comment: '照片详情'
      },
      cover_url: {
        type: Sequelize.STRING(500),
        allowNull: false,
        comment: '图片地址'
      },
      created_at: {
        type: customDataTypes.TIMESTAMP,
        defaultValue: Sequelize.NOW,
        comment: '创建时间'
      }
    }, {
      tableName: 'photos',
      comment: '照片表',
      timestamps: false,
      underscored: true,
    });
  },

  down: function ( queryInterface, Sequelize ) {
    return queryInterface.dropTable('photos');
  }
};
