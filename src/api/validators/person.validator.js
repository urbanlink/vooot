'use strict';

var models = require('../models/index');
var settings = require('../../config/settings');
var logger = require('../../config/logger');


// Check if the requested person exists
exports.hasValidPerson = function(req,res,next) {
  models.person.findById(req.params.id).then(function(person) {

  });
};
