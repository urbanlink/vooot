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

// Synchronize a local account item with the auth0 data. (auth0 takes precendece).
/*

possibilites:
  - auth0 account with vooot-account
  - auth0 account without vooot-account
  - auth0 account with outdated vooot-account
  - auth0 account without vooot-id in app_metadata
*/
exports.sync = function(req,res) {
  var data = req.body;

  if (!data.email) { return handleError(res, 'Required field __email__ is missing. '); }

  models.account.find({
    where: { email: data.email }
  }).then(function(account) {
    // console.log(account);
    if (!account) {
      // Create a new account if it doesn't exist yet
      models.account.create(data).then(function(result) {
        return res.json(result);
      }).catch(function(error) {
        return handleError(res, error);
      });
    } else {
      // Update an existing account with auth0 values if needed.
      models.account.update(data, {
        where: { id: account.dataValues.id }
      }).then(function(result) {
        console.log(result);
        return res.json(result);
      }).catch(function(err){
        console.log(err);
        return handleError(res,err);
      });
    }
  }).catch(function(error) {
    return handleError(res,error);
  });
};

// File index
exports.index = function(req,res) {
  var limit = req.query.limit || 10;
  if (limit > 50) { limit = 50; }
  var offset = req.query.offset || 0;
  var order = req.query.order || 'created_at DESC';
  var filter = {};

  models.account.findAll({
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


// Find an account by id. Only for admins, auth0 and authenticated user account.
exports.show = function(req,res) {
  console.log('Find user account: ' + req.params.id);
  models.account.findOne({
    where: {
      id: req.params.id,
    },
    include: [{
      model: models.person,
      through: models.person_editors,
      as: 'persons'
    }, {
      model: models.event,
      through: models.event_followers,
      as: 'events'
    }]
  }).then(function(account) {
    console.log(account);
    return res.json(account);
  }).catch(function(error) {
    return handleError(res,error);
  });
};


exports.create = function(req,res) {
  models.user.create(req.body).then(function(result) {

  }).catch(function(error){
    console.log(error);
  });
};

exports.update = function(req,res) {
  models.user.create(req.body).then(function(result) {

  }).catch(function(error){
    console.log(error);
  });
};

exports.destroy = function(req,res) {
  models.user.create(req.body).then(function(result) {

  }).catch(function(error){
    console.log(error);
  });
};
