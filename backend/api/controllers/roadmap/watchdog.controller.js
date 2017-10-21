'use strict';

var models = require('../models/index');
var settings = require('../../config/settings');
var path = require('path');
var logger = require('winston');

// error handler
function handleError(res, err) {
  logger.debug('Error: ', err);
  return res.status(500).json({status:'error', msg:err});
}


// File index
exports.index = function(req,res) {
  var limit = req.query.limit || 10;
  if (limit > 50) { limit = 50; }
  var offset = req.query.offset || 0;
  var order = req.query.order || 'created_at DESC';
  var filter = {};

  models.watchdog.findAll({
    where: filter,
    limit: limit,
    offset: offset,
    order: order
  }).then(function(result) {
    return res.json(result);
  }).catch(function(err){
    return res.json({err:err});
  });

};


// Show a single file
exports.show = function(req,res) {
  models.watchdog.findOne({
    where: {
      id: req.params.id
    }
  }).then(function(event){
    return res.json(event);
  }).catch(function(error) {
    return handleError(res,error);
  });
};

exports.add = function(type, severity, message, variables) {
  variables = JSON.stringify(variables) || '';
  models.watchdog.create({
    type: type,
    message: message,
    variables: variables,
    severity: severity}).then(function(result) {
    logger.info('*** Watchdog *** ' + type + ': ' + message + '[' + severity + ']');
  }).catch(function(error){
    logger.info(error);
  });
};
