'use strict';

const bcrypt          = require('bcrypt');
const customDataTypes = require('../../libs/sequelize-mysql-timestamp');

module.exports = function ( sequelize, DataTypes ) {

  let Admin = sequelize.define('Admin', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: DataTypes.STRING,
    salt: DataTypes.STRING, // 密码盐
    hashed_password: DataTypes.STRING,
    nickname: DataTypes.STRING,

    created_at: {
      type: customDataTypes.TIMESTAMP,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'admins',
    timestamps: false,
    underscored: true, // createdAt -> created_at

    getterMethods: {},

    setterMethods: {
      password: function ( value ) {
        const salt           = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(value, salt);

        this.setDataValue('salt', salt);
        this.setDataValue('hashed_password', hashedPassword);
      },
    },

    classMethods: {
      genHashedPassword: function ( password ) {
        const salt           = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        return {
          salt: salt,
          hashedPassword: hashedPassword
        };
      },
      associate: function ( models ) {

      }
    },
    instanceMethods: {
      /**
       * Authenticate - check if the passwords are the same
       *
       * @param {String} plainText
       * @return {Boolean}
       * @api public
       */
      authenticate: function ( plainText ) {
        return bcrypt.compareSync(plainText, this.hashed_password);
      }
    },
    comment: '管理员表'
  });

  return Admin;
};


