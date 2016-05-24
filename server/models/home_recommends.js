'use strict';

const customDataTypes = require('../../libs/sequelize-mysql-timestamp');

module.exports = function ( sequelize, DataTypes ) {

  const HomeRecommend = sequelize.define('HomeRecommend', {
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
    title_image: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: '',
      comment: '标题图'
    },
    url: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: '',
      comment: '链接地址'
    },
    cover_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: '',
      comment: '封面图片地址'
    },
    delete_status: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '删除状态'
    },
    index: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
      comment: '权重'
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
    tableName: 'home_recommends',
    comment: '首页推荐表',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate: function ( models ) {

      }
    }
  });

  return HomeRecommend;
};
