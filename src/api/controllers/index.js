'use strict';

var fs = require('fs');
var path = require('path');
var logger = require('../../config/logger');

var controllers = {};

// Attach specific permission files
fs.readdirSync(__dirname).filter(function(file) {
  return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
}).forEach(function(file) {
  var name = file.split('.')[0];
  var controller = require(path.join(__dirname, file));
  controllers[ name] = controller;
});

// Make the peemissions available in the app.
module.exports = controllers;
