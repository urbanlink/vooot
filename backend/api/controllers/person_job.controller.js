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
  models.person_job.create({
    title: req.body.title,
    description: req.body.description,
    paid: req.body.paid,
    startdate: req.body.startdate,
    enddate: req.body.enddate,
    person_id: req.params.personId
  }).then(function(result) {
    logger.info('Job created.');
    return res.json(result);
  }).catch(function(err) {
    return handleError(res, err);
  });
};

// Update existing contact information
exports.update = function(req, res) { };

// Delete contact information
exports.delete = function(req, res) {
  models.person_job.destroy({
    where: {
      id: req.params.jobId
    }
  }).then(function(result) {
    logger.info('Job deleted', result);
    return res.json(result);
  }).catch(function(error) {
    return handleError(res,error);
  });
};
