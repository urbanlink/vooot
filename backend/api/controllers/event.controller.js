// all validation, sanitation and authorization should be done before this point! (in permission.js and/or validator.js)

'use strict';

var moment = require('moment');
var models = require('../models/index');
var settings = require('../../config/settings');
var logger = require('../../config/logger');


// error handler
function handleError(res, err) {
  logger.debug('Error: ', err);
  return res.status(500).json({status:'error', msg:err});
}


// event index
exports.index = function(req,res) {

  var limit = parseInt(req.query.limit) || 10;
  if (limit > 50) { limit = 50; }
  var offset = parseInt(req.query.offset) || 0;
  var order = req.query.order || 'created_at, DESC';
  var filter = {};

  models.event.findAndCountAll({
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

// Search for a name
exports.query = function(req,res) {
  var limit = parseInt(req.query.limit) || 10;
  if (limit > 50) { limit = 50; }
  var offset = parseInt(req.query.offset) || 0;
  var order = req.query.order || 'created_at DESC';
  var filter = {
    name: {
      $like: '%' + String(req.query.term) + '%'
    }
  };
  models.event.findAndCountAll({
    where: filter,
    limit: limit,
    offset: offset,
    order: order,
    include: [
      { model: models.identifier, as: 'identifiers', attributes: ['scheme', 'identifier'] }
    ]
  }).then(function(result) {
    return res.json(result);
  }).catch(function(err) {
    return handleError(res,err);
  });
};

// Show a single event
exports.show = function(req,res) {
  models.event.find({
    where: {
      id: req.params.eventId
    },
    include: [{
      // Person's identifiers
      model: models.identifier,
      as: 'identifiers',
      // foreignKey: 'event_id',
      attributes: ['id', 'value'],
      include: [{
        // Identifier type
        model: models.identifier_type,
        as: 'type',
        attributes: ['id', 'value']
      }]
    }, {
      // Person's othernames
      model: models.event_othername,
      as: 'othernames',
      // foreignKey: 'event_id',
      attributes: ['id', 'name'],
      include: [{
        // Othername type
        model: models.event_othername_type,
        as: 'type',
        attributes: ['id', 'value']
      }]
    }, {
      // Person's contacts
      model: models.event_contact,
      as: 'contacts',
      // foreignKey: 'event_id',
      attributes: ['id', 'value'],
      include: [{
        // Othername type
        model: models.event_contact_type,
        as: 'type',
        attributes: ['id', 'value']
      }]
    }, {
      // Person's contacts
      model: models.link,
      as: 'links',
      attributes: ['id', 'value', 'title', 'description', 'category'],
    },
    {
      // Person's jobs
      model: models.event_job,
      as: 'jobs',
      // attributes: ['id', 'value', 'title', 'description', 'category'],
    }
  ]
  }).then(function(event){
    return res.json(event);
  }).catch(function(error) {
    return handleError(res,error);
  });
};

// Create a event
exports.create = function(req,res) {
  // Validate input
  console.log('Creating new event', req.body);
  var event = req.body;
  event.startdate = moment.utc(event.startdate, 'x').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
  event.enddate = moment.utc(event.enddate, 'x').format('YYYY-MM-DDTHH:mm:ss.SSSZ');

  models.event.create(req.body).then(function(result) {
    return res.json(result);
  }).catch(function(err) {
    return handleError(res,err);
  });
};

// Update a event record
exports.update = function(req,res) {
  logger.info('Updating event ' + req.event.dataValues.id);
  models.event.update(req.body, {
    where: { id: req.event.dataValues.id }
  }).then(function(result) {
    return res.json(result);
  }).catch(function(err){
    return handleError(res,err);
  });
};

// Delete a event record
exports.delete = function(req,res){
  models.event.destroy({
    where: { id: req.params.eventId }
  }).then(function(result){
    return res.json(result);
  }).catch(function(err){
    return handleError(res,err);
  });
};










// exports.follow = function(req,res) {
//   logger.info('Person controller: Follow event.');
//   logger.info(req.body);
//   // First find the event
//   models.event.findById(req.body.event_id).then(function(event) {
//     // then find the account
//     models.account.findById(req.body.account_id).then(function(account) {
//       if (account){
//         event.addFollower(account).then(function(result) {
//
//           // stream.follow({
//           //   user_id: req.body.account_id,
//           //   follower_type: 'event',
//           //   follower_id: req.body.event_id,
//           //   insertId: 1,
//           //   created_at: new Date()
//           // }, function(result) {
//           //   logger.info(result);
//           // });
//
//           return res.json(result);
//         }).catch(function(error){
//           return handleError(res,error);
//         });
//       } else {
//         return handleError(res,'Account not found');
//       }
//     });
//   }).catch(function(error) {
//     return handleError(error);
//   });
// };
//
// exports.unfollow = function(req,res) {
//   // first find the event
//   models.event.findById(req.body.event_id).then(function(event) {
//     if (event) {
//       // then find the account
//       models.account.findById(req.body.account_id).then(function(account) {
//         if (account){
//           event.removeFollower(account).then(function(result){
//             return res.json(result);
//           }).catch(function(error){
//             return handleError(res, error);
//           });
//         } else {
//           return handleError(res,'Account not found');
//         }
//       });
//     }
//   }).catch(function(error) {
//     return handleError(error);
//   });
// };
//
//
// // event editors
// exports.addEditor = function(req,res) {
//   logger.info('adding editor');
//   models.event.findById(req.params.id).then(function(event) {
//     if (!event) { return res.json(event); }
//     // If role is owner, check if one does not exist already
//     // event.getEditors().then(function(result) {
//     //   logger.info(result);
//     //
//     // });
//     models.account.findById(req.body.account_id).then(function(account) {
//       if (!account) { return res.json(account); }
//       event.addEditor(account, {role: req.body.role}).then(function(result) {
//         //logger.debug(result);
//         return res.json(result);
//       }).catch(function(error) {
//         return handleError(res,error);
//       });
//     }).catch(function(error) {
//       return handleError(res,error);
//     });
//   }).catch(function(error) {
//     return handleError(res,error);
//   });
// };
