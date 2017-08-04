'use strict';

var models = require('../models/index');
var settings = require('../../config/settings');
var logger = require('../../config/logger');


// SANITIZE

// VALIDATE
// Check if the requested person exists in the database
exports.isPerson = function(req,res,next) {
  if (req.person) { return true; }
  models.person.findById(req.params.id).then(function(person) {
    if (person) { return true; }
    return false;
  });
};

//
exports.isContactType = function(req,res,next) {
  models.person.findById(req.params.id).then(function(person) {

  });
};

//
exports.isContact = function(req,res,next) {
  models.person.findById(req.params.id).then(function(person) {

  });
};
