'use strict';

var models = require('../models/index');

// error handler
function handleError(res, err) {
  console.log('Error: ', err);
  return res.status(500).json({status:'error', msg:err});
}


// Organization index
exports.index = function(req,res) {
  var limit = req.query.limit || 10;
  if (limit > 50) { limit = 50; }
  var offset = req.query.offset || 0;
  var order = req.query.order || 'created_at DESC';
  var filter = {};

  models.Organization.findAndCountAll({
    where: filter,
    limit: limit,
    offset: offset,
    order: order,
    include: [
      { model: models.Identifier, as: 'identifiers', attributes: ['scheme', 'identifier'] }
    ]
  }).then(function(result) {
    return res.json(result);
  }).catch(function(err) {
    return handleError(res,err);
  });

};

exports.show = function(req,res) {
  models.Organization.findOne({
    where: { id: req.params.id }
  }).then(function(event){
    return res.json(event);
  });
};

exports.create = function(req,res){
  models.Organization.create(req.body).then(function(result) {
    return res.json(result);
  }).catch(function(err) {
    handleError(res,err);
  });
};

exports.update = function(req,res){
  models.Organization.update(req.body, {
    where: { id: req.params.id }
  }).then(function(result){
    return res.json(result);
  }).catch(function(err){
    handleError(res,err);
  });
};

exports.destroy = function(req,res){
  models.Organization.destroy({
    where: { id: req.params.id }
  }).then(function(result){
    return res.json(result);
  }).catch(function(err){
    handleError(res,err);
  });
};
