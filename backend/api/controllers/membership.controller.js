'use strict';

// Requirements
var models = require('../models/index');
var settings = require('../../config/settings');
var logger = require('../../config/logger');
var utils = require('../utils');


// Retrieve a list of memberships
exports.index = function(req, res) {
  var limit = parseInt(req.query.limit) || 10;
  if (limit > 50) { limit = 50; }
  var offset = parseInt(req.query.offset) || 0;
  var order = req.query.order || 'created_at, DESC';
  var filter = {};

  console.log(req.query);
  if (req.query.organization_id) {
    filter.organization_id = req.query.organization_id;
  }
  if (req.query.role_id) {
    filter.role_id = req.query.role_id;
  }
  models.membership.findAndCountAll({
    where: filter,
    limit: limit,
    offset: offset,
    // order: [[order]]
    include: [{
      model: models.person,
      as: 'person'
    }]
  }).then(function(result) {
    return res.json(result);
  }).catch(function(err){
    return res.json({err:err});
  });
};


// Create a new membership
exports.create = function(req, res) {
  // create the new contact and add it to the person
    models.membership.create({
      label: req.body.label,
      startdate: req.body.startdate,
      enddate: req.body.enddate,
      person_id: req.body.person_id,
      organization_id: req.body.organization_id,
      role_id: req.body.role_id
    }).then(function(response) {
      logger.info('membership created.');
      return res.json(response);
    }).catch(function(err) {
      return utils.handleError(res, err);
    });

};


// Show a single membership
exports.show = function(req,res) {
  models.membership.find({
    where: {
      id: req.params.id
    },
    include: [{
      model: models.membership_role,
      as: 'role',
    }
  ]
  }).then(function(event){
    return res.json(event);
  }).catch(function(error) {
    utils.handleError(res,error);
  });
};


// Update an existing membership
exports.update = function(req, res) {
  logger.info('Updating membership ', req.params.id, req.body);
  logger.info('Updating membership ', req.body);
  models.membership.update(req.body, {
    where: { id: req.params.id }
  }).then(function(result) {
    return res.json(result);
  }).catch(function(err){
    utils.handleError(res,err);
  });
};


// Delete an membership
exports.delete = function(req, res) {
  models.membership.destroy({
    where: {
      id: req.params.id
    }
  }).then(function(result) {
    logger.info('Organization deleted', result);
    return res.json(result);
  }).catch(function(error) {
    return utils.handleError(res,error);
  });
};


// List of classifications for an membership
exports.roleTypes = function(req, res) {
  models.membership_role.findAll().then(function(roles) {
    return res.json(roles);
  }).catch(function(err) {
    utils.handleError(res, err);
  });
};
