'use strict';

var models = require('../models/index');
var settings = require('../../config/settings');
var jwt = require('../middleware/jwt.service');

exports.canView = function(req,res,next) {
  next();
};

exports.canCreate = function(req,res,next) {
  next();
};

exports.canUpdate = function(req,res,next) {
  next();
};

exports.canDelete = function(req,res,next) {
  next();
};
