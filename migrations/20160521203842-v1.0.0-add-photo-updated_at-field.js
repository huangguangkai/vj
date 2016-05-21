'use strict';

const customDataTypes = require('../libs/sequelize-mysql-timestamp');

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('photos', 'updated_at', {
      type: customDataTypes.TIMESTAMP,
      defaultValue: Sequelize.NOW,
      comment: '更新时间'
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
