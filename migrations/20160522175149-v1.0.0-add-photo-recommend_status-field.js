'use strict';

const customDataTypes = require('../libs/sequelize-mysql-timestamp');

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('photos', 'recommend_status', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '推荐状态'
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
