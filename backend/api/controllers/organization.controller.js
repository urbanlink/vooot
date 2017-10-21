'use strict';

// Requirements
var models = require('../models/index');
var settings = require('../../config/settings');
var logger = require('../../config/logger');
var utils = require('../utils');


// Retrieve a list of organizations
exports.index = function(req, res) {
  var limit = parseInt(req.query.limit) || 10;
  if (limit > 50) { limit = 50; }
  var offset = parseInt(req.query.offset) || 0;
  var order = req.query.order || 'created_at, DESC';
  var filter = {};

  console.log(req.query);
  if (req.query.parent_id) {
    filter.parent_id = req.query.parent_id;
  }
  if (req.query.classification_id) {
    filter.classification_id = req.query.classification_id;
  }
  models.organization.findAndCountAll({
    where: filter,
    limit: limit,
    offset: offset,
    // order: [[order]]
  }).then(function(result) {
    return res.json(result);
  }).catch(function(err){
    return res.json({err:err});
  });
};


// Create a new organization
exports.create = function(req, res) {
  // create the new contact and add it to the person
    models.organization.create({
      name: req.body.name,
      summary: req.body.summary,
      startdate: req.body.startdate,
      enddate: req.body.enddate,
      classification_id: req.body.classification_id,
      parent_id: req.body.parent_id
    }).then(function(response) {
      logger.info('organization created.');
      return res.json(response);
    }).catch(function(err) {
      return utils.handleError(res, err);
    });

};


// Show a single organization
exports.show = function(req,res) {
  models.organization.find({
    where: {
      id: req.params.organizationId
    },
    include: [{
      model: models.identifier,
      as: 'identifiers',
      foreignKey: 'organization_id',
      attributes: ['id', 'value'],
      include: [{
        // Identifier type
        model: models.identifier_type,
        as: 'type',
        attributes: ['id', 'value']
      }]
    }, {
      model: models.organization,
      as: 'parent',
    }, {
      model: models.organization_classification,
      as: 'classification',
    }
  ]
  }).then(function(event){
    return res.json(event);
  }).catch(function(error) {
    utils.handleError(res,error);
  });
};


// Update an existing organization
exports.update = function(req, res) {
  logger.info('Updating organization ', req.params.organizationId, req.body);
  models.organization.update(req.body, {
    where: { id: req.params.organizationId }
  }).then(function(result) {
    return res.json(result);
  }).catch(function(err){
    utils.handleError(res,err);
  });
};


// Delete an organization
exports.delete = function(req, res) {
  models.organization.destroy({
    where: {
      id: req.params.organizationId
    }
  }).then(function(result) {
    logger.info('Organization deleted', result);
    return res.json(result);
  }).catch(function(error) {
    return utils.handleError(res,error);
  });
};


// List of classifications for an organization
exports.classifications = function(req, res) {
  models.organization_classification.findAll().then(function(types) {
    return res.json(types);
  }).catch(function(err) {
    utils.handleError(res,err);
  });
};
