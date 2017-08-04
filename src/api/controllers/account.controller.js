'use strict';

var models = require('../models/index');
var settings = require('../../config/settings');

var logger = require('../../config/logger');

// error handler
function handleError(res, err) {
  logger.debug('Error: ', err);
  return res.status(500).json({status:'error', msg:err});
}


// Return currently logged in user
exports.me = function(req,res) {

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
  logger.info('Find user account: ' + req.params.id);
  // models.account.findOne({
  //   where: {
  //     id: req.params.id,
  //   },
  //   include: [{
  //     model: models.person,
  //     through: models.person_editors,
  //     as: 'persons'
  //   }, {
  //     model: models.event,
  //     through: models.event_followers,
  //     as: 'events'
  //   }]
  // }).then(function(account) {
  //   // connect to stream.io
  //   var userFeed = stream.feed('timeline_aggregated', account.dataValues.id);
  //   // get activities from stream
  //   userFeed.get({ limit: 100 }).then(function(stream) {
  //     account.dataValues.userFeed = stream;
  //   });
  //
  //
  //   var notification_1 = stream.feed('notification', account.dataValues.id);
  //   notification_1.get({'limit': 30}).then(function(result) {
  //     logger.info('result', result);
  //     account.dataValues.notification = result;
  //     var timeline_1 = stream.feed('timeline', account.dataValues.id);
  //     timeline_1.get({'limit': 30}).then(function(result) {
  //       logger.info('result', result);
  //       account.dataValues.stream = result;
  //       return res.json(account);
  //
  //     }).catch(function(error) {
  //       logger.info(error);
  //       return res.json(account);
  //     });
  //   });
  //
  //   // return res.json(account);
  // }).catch(function(error) {
  //   return handleError(res,error);
  // });
};


exports.create = function(req,res) {
  models.user.create(req.body).then(function(result) {

  }).catch(function(error){
    logger.info(error);
  });
};


exports.update = function(req,res) {
  models.user.create(req.body).then(function(result) {

  }).catch(function(error){
    logger.info(error);
  });
};


exports.destroy = function(req,res) {
  models.user.create(req.body).then(function(result) {

  }).catch(function(error){
    logger.info(error);
  });
};
