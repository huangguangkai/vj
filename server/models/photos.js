'use strict';

const customDataTypes = require('../../libs/sequelize-mysql-timestamp');

module.exports = function ( sequelize, DataTypes ) {

  const Photo = sequelize.define('Photo', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: 'ID'
    },
    category_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '分类ID'
    },
    category_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: '',
      charset: 'utf8mb4',
      comment: '分类名'
    },
    package_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '套餐ID'
    },
    package_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: '',
      charset: 'utf8mb4',
      comment: '套餐名'
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: '',
      charset: 'utf8mb4',
      comment: '照片名'
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      comment: '照片详情'
    },
    cover_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: '图片地址'
    },
    delete_status: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '删除状态'
    },
    created_at: {
      type: customDataTypes.TIMESTAMP,
      defaultValue: DataTypes.NOW,
      comment: '创建时间'
    },
    updated_at: {
      type: customDataTypes.TIMESTAMP,
      defaultValue: DataTypes.NOW,
      comment: '更新时间'
    }
  }, {
    tableName: 'photos',
    comment: '照片表',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate: function ( models ) {
        Photo.belongsTo(models.PhotoCategory, {
          as: 'category',
          foreignKey: 'category_id',
          constraints: false
        });

        Photo.belongsTo(models.PhotoPackage, {
          as: 'package',
          foreignKey: 'package_id',
          constraints: false
        });
      }
    }
  });

  return Photo;
};
