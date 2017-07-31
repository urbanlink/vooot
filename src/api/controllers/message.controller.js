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
  logger.debug('[Message Controller] - Index');

  var limit = req.query.limit || 10;
  if (limit > 50) { limit = 50; }
  var offset = req.query.offset || 0;
  var order = req.query.order || 'created_at DESC';
  var filter = {};
  if (req.query.person_id) { filter.person_id = req.query.person_id; }

  models.message.findAndCountAll({
    where: filter,
    limit: limit,
    offset: offset,
    order: order,
    include: [{
      model: models.account, as:'sender'
    }]
  }).then(function(result) {
    return res.json(result);
  }).catch(function(error) {
    return handleError(res, error);
  });
};


// Show a single file
exports.show = function(req,res) {
  models.message.findOne({
    where: {
      id: req.params.id
    }
  }).then(function(event){
    return res.json(event);
  }).catch(function(error) {
    return handleError(res,error);
  });
};


// Create a file
exports.create = function(req,res){
  models.message.create(req.body).then(function(result) {
    return res.json(result);
  }).catch(function(err) {
    return handleError(res,err);
  });
};


// Update a file record
exports.update = function(req,res) {
  console.log('Updating message ' + req.params.id);
  models.message.update(req.body, {
    where: { id: req.params.id }
  }).then(function(result) {
    console.log('done');
    return res.json(result);
  }).catch(function(err){
    return handleError(res,err);
  });
};


// Delete a file record
exports.destroy = function(req,res){
  models.message.destroy({
    where: { id: req.params.id }
  }).then(function(result){
    return res.json(result);
  }).catch(function(err){
    return handleError(res,err);
  });
};
