'use strict';

var fs = require('fs');
var path = require('path');
var logger = require('../../config/logger');
var models = require('../models/index');
var settings = require('../../config/settings');
var auth = require('../../config/auth');
var utils = require('./../utils');

// General permissions
var permissions = {};


// Attach specific permission files
fs.readdirSync(__dirname).filter(function(file) {
  return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
}).forEach(function(file) {
  var name = file.split('.')[0];
  var permission = require(path.join(__dirname, file));
  permissions[ name] = permission;
});


permissions.canView = function(req,res,next) {
  next();
};


/**
 *
 * Check if current user can create a new Person
 *
 **/
permissions.canCreate = function(req,res,next) {
  console.log('Validating canCreate: ', req.user);
  if (auth.isAdmin(req.user) || auth.isEditor(req.user) ){
    return next();
  }

  return utils.handleError(res, 'No access');
};


/**
 *
 * Check if current user can update a Person
 *
 */
permissions.canUpdate = function(req,res,next) {
  if (auth.isAdmin(req.user) || auth.isEditor(req.user) ){
    return next();
  }
  return utils.handleError(res, 'No access');
};


/**
 *
 * Check if current user can delete a Person
 *
 */
permissions.canDelete = function(req,res,next) {
  if (auth.isAdmin(req.user) || auth.isEditor(req.user) ){
    return next();
  }

  return utils.handleError(res, 'No access');
};


// Make the peemissions available in the app.
module.exports = permissions;
