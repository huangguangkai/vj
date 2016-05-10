'use strict';

const customDataTypes = require('../../libs/sequelize-mysql-timestamp');

module.exports = function ( sequelize, DataTypes ) {

  const PhotoCategory = sequelize.define('PhotoCategory', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: 'ID'
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: '',
      charset: 'utf8mb4',
      comment: '分类名'
    },
    name_image: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: '',
      comment: '分类名图'
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
    tableName: 'photo_categories',
    comment: '照片分类表',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate: function ( models ) {
        PhotoCategory.hasMany(models.Photo, {
          as: 'photos',
          constraints: false,
          foreignKey: 'category_id',
        });

        PhotoCategory.hasMany(models.PhotoPackage, {
          as: 'packages',
          constraints: false,
          foreignKey: 'category_id',
        });
      }
    }
  });

  return PhotoCategory;
};
