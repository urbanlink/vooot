'use strict';

var models = require('../models/index');
var settings = require('../../config/settings');
var logger = require('../../config/logger');

exports.isRoleInt = function(req,res,next) {
  //req.checkBody(req.body.role_id, 'Invalid role_id parameter.').isInt();

  req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {
      return res.json(result.array());
    }
    next();
  });
};
