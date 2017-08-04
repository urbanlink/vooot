'use strict';

var models = require('../src/api/models/index.js');

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable(models.User.tableName,
      models.User.attributes);
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Users');
  }
};
