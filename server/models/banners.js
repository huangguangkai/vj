'use strict';

const customDataTypes = require('../../libs/sequelize-mysql-timestamp');

module.exports = function ( sequelize, DataTypes ) {

  const Banner = sequelize.define('Banner', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: 'ID'
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: '',
      charset: 'utf8mb4',
      comment: '标题'
    },
    url: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: '',
      comment: '广告链接地址'
    },
    cover_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: '',
      comment: '封面图片地址'
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
    tableName: 'banners',
    comment: '广告表',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate: function ( models ) {

      }
    }
  });

  return Banner;
};
