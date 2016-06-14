'use strict';

const customDataTypes = require('../libs/sequelize-mysql-timestamp');

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('photo_packages', 'name_en', {
      type: Sequelize.STRING(100),
      allowNull: false,
      defaultValue: '',
      charset: 'utf8mb4',
      comment: '英文标题'
    });
    queryInterface.addColumn('photo_packages', 'name_image_en', {
      type: Sequelize.STRING(500),
      allowNull: false,
      defaultValue: '',
      comment: '英文标题图'
    });
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
