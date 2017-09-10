'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var settings    = require('../../config/settings');
var env       = settings.env;
var logger = require('../../config/logger');

// Initialize the database connection
var sequelize = new Sequelize(settings.db.name, settings.db.username, settings.db.password, settings.db.settings);

var db = {
  sequelize: sequelize,
  Sequelize: Sequelize
};

// Test the connection
sequelize.authenticate().then(function() {
  logger.info('Connection has been established successfully.');

  // Setup the models
  fs.readdirSync(__dirname).filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
  }).forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

  // Create associations for loaded models
  Object.keys(db).forEach(function(modelName) {
    if ('associate' in db[modelName]) {
      db[modelName].associate(db);
    }
  });

  // Synchronize the database if needed
  if (settings.db.sync === 'true') {
    sequelize.sync({ force: settings.db.forceSync }).then(function(result) {
      // Seed the database
      require(path.join(__dirname, '../../../db/seeders/seed'));
      return true;
    });
  }
}).catch(function(err) {
  logger.debug('Unable to connect to the database:', err);
});


module.exports = db;
