'use strict';

var models = require('../models/index');
var settings = require('../../config/settings');
var logger = require('../../config/logger');


// Error handler
function handleError(res, err) {
  logger.debug('Error: ', err);
  return res.status(500).json({status:'error', msg:err});
}


// Add contact information to a person
exports.create = function(req, res) {
  // create the new contact and add it to the person
  models.person.findById(req.params.id).then(function(person) {
    if (!person) { return res.json({ status: 'Person not found. '} ); }
    models.person_contact_type.findById(req.body.type_id).then(function(type) {
      if (!type) { return res.json({ status: 'Contact type not found '}); }
      models.person_contact.create({
        value: req.body.value,
        type_id: req.body.type_id,
        person_id: req.params.personId
      }).then(function(contact) {
        logger.info('Contact created.');
        return res.json(contact);
      }).catch(function(err) {
        return handleError(res, err);
      });
    }).catch(function(err) {
      return res.handleError(res,err);
    });
  }).catch(function(err) {
    return handleError(res, err);
  });
};


// Update existing contact information
exports.update = function(req,res) { };

// Delete contact information
exports.delete = function(req,res) {
  models.person_contact.destroy({
    where: {
      id: req.params.contactId
    }
  }).then(function(result) {
    logger.info('Contact deleted', result);
    return res.json(result);
  }).catch(function(error) {
    return handleError(res,error);
  });
};
