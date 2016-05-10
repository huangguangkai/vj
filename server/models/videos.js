'use strict';

const customDataTypes = require('../../libs/sequelize-mysql-timestamp');

module.exports = function ( sequelize, DataTypes ) {

  const Video = sequelize.define('Video', {
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
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      comment: '详情'
    },
    description_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: '',
      comment: '详情图'
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
    tableName: 'videos',
    comment: '视频表',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate: function ( models ) {

      }
    }
  });

  return Video;
};
