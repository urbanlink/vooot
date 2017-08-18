'use strict';

var models = require('../models/index');
var settings = require('../../config/settings');
var logger = require('../../config/logger');


// error handler
function handleError(res, err) {
  logger.debug('Error: ', err);
  return res.status(500).json({status:'error', msg:err});
}

// Add contact information to a person
exports.create = function(req, res) {
  // create the new contact and add it to the person
    models.link.create({
      title: req.body.title,
      value: req.body.value,
      description: req.body.description,
      category: req.body.category,
      person_id: req.body.person_id
    }).then(function(link) {
      logger.info('Link created.');
      return res.json(link);
    }).catch(function(err) {
      return handleError(res, err);
    });

};

// Update existing contact information
exports.update = function(req, res) { };

// Delete contact information
exports.delete = function(req, res) {
  models.link.destroy({
    where: {
      id: req.params.linkId
    }
  }).then(function(result) {
    logger.info('Link deleted', result);
    return res.json(result);
  }).catch(function(error) {
    return handleError(res,error);
  });
};
