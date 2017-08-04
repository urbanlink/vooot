'use strict';

var models = require('../models/index');
var settings = require('../../config/settings');

exports.canView = function(req,res,next) {
  next();
};

exports.canCreate = function(req,res,next) {
  next();
};

exports.canUpdate = function(req,res,next) {
  // Todo: Validate user access

  // Todo: validate if current user can update the requested person

  // Add requested person to request
  models.person.findById(req.params.personId).then(function(person) {
    if (!person) { return res.json({status: 'Person not found. '}); }
    req.person = person;
    next();
  }).catch(function(err) {
    return res.status(500).json({err: err});
  });

};

exports.canDelete = function(req,res,next) {
  // Todo: Validate user access

  // Todo: validate if current user can update the requested person

  // Add requested person to request
  models.person.findById(req.params.personId).then(function(person) {
    if (!person) { return res.json({status: 'Person not found. '}); }
    req.person = person;
    next();
  }).catch(function(err) {
    return res.status(500).json({err: err});
  });
};
