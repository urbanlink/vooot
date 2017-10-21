'use strict';

var models = require('../models/index');
var settings = require('../../config/settings');
var logger = require('../../config/logger');


// error handler
function handleError(res, err) {
  logger.debug('Error: ', err);
  return res.status(500).json({status:'error', msg:err});
}

// create the new name and add it to the person
exports.create = function(req, res) {
  // check othername type
  models.person_othername_type.findById(req.body.type_id).then(function(type) {
    if (!type) { return res.json({ status: 'Othername type not found '}); }
    models.person_othername.create({
      name: req.body.name,
      type_id: req.body.type_id,
      person_id: req.params.personId
    }).then(function(othername) {
      logger.info('Othername created.');
      return res.json(othername);
    }).catch(function(err) {
      return handleError(res, err);
    });
  }).catch(function(err) {
    return res.handleError(res,err);
  });

};

// Update existing contact information
exports.update = function(req,res) { };

// Delete contact information
exports.delete = function(req,res) {
  logger.info('Removing name: ' + req.params);
  logger.info('Removing name: ' + req.params.othernameId);

  models.person_othername.destroy({
    where: {
      id: req.params.othernameId
    }
  }).then(function(result) {
    logger.info('Othername deleted', result);
    return res.json(result);
  }).catch(function(error) {
    return handleError(res,error);
  });
};
