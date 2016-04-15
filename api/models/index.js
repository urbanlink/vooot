'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var settings    = require('./../../config/settings');

var sequelize = new Sequelize(settings.database.database, settings.database.username, settings.database.password, {
  host: settings.database.host,
  dialect: settings.database.dialect,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  logging: false,
  define: {
    underscored: true,
    timestamps: true
  }
});


var db = {};

fs.readdirSync(__dirname).filter(function(file) {
  return (file.indexOf('.') !== 0) && (file !== 'index.js');
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


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
