'use strict';

var models = require('../models/index');
var settings = require('../../config/settings');
var auth = require('../../config/auth');


exports.canView = function(req,res,next) {
  next();
};

exports.canCreate = function(req,res,next) {
  if (auth.isAdmin(req.user) || auth.isEditor(req.user) ){
    return next();
  }

  return res.json({status:'no access'});
};

exports.canUpdate = function(req,res,next) {
  if (auth.isAdmin(req.user) || auth.isEditor(req.user) ){
    return next();
  }

  return res.json({status:'no access'});
};

exports.canDelete = function(req,res,next) {
  if (auth.isAdmin(req.user) || auth.isEditor(req.user) ){
    return next();
  }

  return res.json({status:'no access'});
};
