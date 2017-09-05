'use strict';

var models = require('../models/index');
var settings = require('../../config/settings');
var auth = require('../../config/auth');

exports.canView = function(req,res,next) {
  next();
};


/**
 *
 * Check if current user can create a new Person
 *
 **/
exports.canCreate = function(req,res,next) {
  if (auth.isAdmin(req.user) || auth.isEditor(req.user) ){
    return next();
  }

  return res.json({status:'no access'});
};


/**
 *
 * Check if current user can update a Person
 *
 */
exports.canUpdate = function(req,res,next) {
  if (auth.isAdmin(req.user) || auth.isEditor(req.user) ){
    return next();
  }
  return res.json({status:'no access'});
};


/**
 *
 * Check if current user can delete a Person
 *
 */
exports.canDelete = function(req,res,next) {
  if (auth.isAdmin(req.user) || auth.isEditor(req.user) ){
    return next();
  }

  return res.json({status:'no access'});
};
