'use strict';

const customDataTypes = require('../../libs/sequelize-mysql-timestamp');

module.exports = function ( sequelize, DataTypes ) {

  const PhotoPackage = sequelize.define('PhotoPackage', {
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: '',
      charset: 'utf8mb4',
      comment: '套餐名'
    },
    name_image: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: '',
      comment: '套餐名图'
    },
    name_en: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: '',
      charset: 'utf8mb4',
      comment: '英文名'
    },
    name_image_en: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: '',
      comment: '英文名图'
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      comment: '套餐详情'
    },
    description_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: '',
      comment: '套餐详情图片介绍链接'
    },
    cover_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: '',
      comment: '封面图片地址'
    },
    video_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: '',
      comment: '视频地址'
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
    tableName: 'photo_packages',
    comment: '照片套餐表',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate: function ( models ) {
        PhotoPackage.belongsTo(models.PhotoCategory, {
          as: 'category',
          foreignKey: 'category_id',
          constraints: false
        });

        PhotoPackage.hasMany(models.Photo, {
          as: 'photos',
          constraints: false,
          foreignKey: 'package_id',
        });
      }
    }
  });

  return PhotoPackage;
};
