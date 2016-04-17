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

  models.File.findAndCountAll({
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
  models.File.findOne({
    where: {
      id: req.params.id
    },
    include: [
      { model: models.Identifier, as:'identifiers', attributes: ['scheme','identifier'] }
    ]
  }).then(function(event){
    return res.json(event);
  }).catch(function(error) {
    return handleError(res,error);
  });
};


// Create a file
exports.create = function(req,res){
  models.File.create(req.body).then(function(result) {
    return res.json(result);
  }).catch(function(err) {
    return handleError(res,err);
  });
};


// Update a file record
exports.update = function(req,res){
  models.File.update(req.body, {
    where: { id: req.params.id }
  }).then(function(result){
    return res.json(result);
  }).catch(function(err){
    return handleError(res,err);
  });
};


// Delete a file record
exports.destroy = function(req,res){
  models.File.destroy({
    where: { id: req.params.id }
  }).then(function(result){
    return res.json(result);
  }).catch(function(err){
    return handleError(res,err);
  });
};


exports.syncFile = function(req,res) {
  return res.json('sync');
};
