'use strict';

var models = require('../models/index');
var settings = require('../../config/settings');
var path = require('path');
var logger = require('../../config/logger');


// error handler
function handleError(res, err) {
  logger.debug('Error: ', err);
  return res.status(500).json({status:'error', msg:err});
}


// person index
exports.index = function(req,res) {

  var limit = parseInt(req.query.limit) || 10;
  if (limit > 50) { limit = 50; }
  var offset = parseInt(req.query.offset) || 0;
  var order = req.query.order || 'created_at, DESC';
  var filter = {};

  models.person.findAndCountAll({
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
  models.person.findAndCountAll({
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

// Show a single person
exports.show = function(req,res) {
  models.person.find({
    where: {
      id: req.params.id
    },
    include: [{
      // Person's identifiers
      model: models.identifier,
      as: 'identifiers',
      // foreignKey: 'person_id',
      attributes: ['id', 'value'],
      include: [{
        // Identifier type
        model: models.identifier_type,
        as: 'type',
        attributes: ['id', 'value']
      }]
    }, {
      // Person's othernames
      model: models.person_othername,
      as: 'othernames',
      // foreignKey: 'person_id',
      attributes: ['id', 'name'],
      include: [{
        // Othername type
        model: models.person_othername_type,
        as: 'type',
        attributes: ['id', 'value']
      }]
    }, {
      // Person's contacts
      model: models.person_contact,
      as: 'contacts',
      // foreignKey: 'person_id',
      attributes: ['id', 'value'],
      include: [{
        // Othername type
        model: models.person_contact_type,
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
      model: models.person_job,
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


// POST
// Create a person
exports.create = function(req,res) {
  // Validate input

  models.person.create(req.body).then(function(result) {
    return res.json(result.dataValues.id);
  }).catch(function(err) {
    return handleError(res,err);
  });
};

exports.addIdentifier = function(req, res) {
  models.person.findById(req.params.id).then(function(person){
    if (!person) { return res.json({ status: 'Person not found.'}); }
    models.identifier.create({
      value: req.body.value,
      type_id: req.body.type_id,
      person_id: req.params.id
    }).then(function(result) {
      logger.info('Identifier created. ');
      return res.json(result);
    }).catch(function(error) {
      return handleError(res,error);
    });
  }).catch(function(error) {
    return handleError(res,error);
  });
};

exports.addName = function(req, res) {
  // create the new name and add it to the person
  models.person.findById(req.params.id).then(function(person) {
    if (!person) { return res.json({ status: 'Person not found. '} ); }
    models.person_othername_type.findById(req.body.type_id).then(function(type) {
      if (!type) { return res.json({ status: 'Othername type not found '}); }
      models.person_othername.create({
        name: req.body.name,
        type_id: req.body.type_id,
        person_id: req.params.id
      }).then(function(othername) {
        logger.info('Othername created.');
        return res.json(othername);
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

exports.addContact = function(req, res) {
  // create the new contact and add it to the person
  models.person.findById(req.params.id).then(function(person) {
    if (!person) { return res.json({ status: 'Person not found. '} ); }
    models.person_contact_type.findById(req.body.type_id).then(function(type) {
      if (!type) { return res.json({ status: 'Contact type not found '}); }
      models.person_contact.create({
        value: req.body.value,
        type_id: req.body.type_id,
        person_id: req.params.id
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

exports.addLink = function(req, res) {
  // create the new contact and add it to the person
  models.person.findById(req.params.id).then(function(person) {
    if (!person) { return res.json({ status: 'Person not found. '} ); }
    models.link.create({
      title: req.body.title,
      value: req.body.value,
      description: req.body.description,
      category: req.body.category,
      person_id: req.params.id
    }).then(function(link) {
      logger.info('Link created.');
      return res.json(link);
    }).catch(function(err) {
      return handleError(res, err);
    });
  }).catch(function(err) {
    return handleError(res, err);
  });
};
exports.addJob = function(req, res) {
  // create the new contact and add it to the person
  models.person.findById(req.params.id).then(function(person) {
    if (!person) { return res.json({ status: 'Person not found. '} ); }
    models.person_job.create({
      title: req.body.title,
      description: req.body.description,
      paid: req.body.paid,
      startdate: req.body.startdate,
      enddate: req.body.enddate,
      person_id: req.params.id
    }).then(function(result) {
      logger.info('Job created.');
      return res.json(result);
    }).catch(function(err) {
      return handleError(res, err);
    });
  }).catch(function(err) {
    return handleError(res, err);
  });
};

// PUT
// Update a person record
exports.update = function(req,res) {
  logger.info('Updating person ' + req.params.id);
  models.person.update(req.body, {
    where: { id: req.params.id }
  }).then(function(result) {
    return res.json(result);
  }).catch(function(err){
    return handleError(res,err);
  });
};

exports.updateIdentifier =function(req,res) { };
exports.updateName = function(req,res) { };
exports.updateContact = function(req,res) { };
exports.updateLink = function(req, res) { };
exports.updateJob = function(req, res) { };


// DELETE
// Delete a person record
exports.delete = function(req,res){
  models.person.destroy({
    where: { id: req.params.personId }
  }).then(function(result){
    return res.json(result);
  }).catch(function(err){
    return handleError(res,err);
  });
};

// Remove an identifier and remove it from a person
exports.deleteIdentifier =function(req,res) {
  logger.info('Removing identifier: ' + req.params.identifierId);
  models.identifier.destroy({
    where: {
      id: req.params.identifierId
    }
  }).then(function(result) {
    logger.info('Identifier desctroyed', result);
    return res.json(result);
  }).catch(function(error) {
    return handleError(res,error);
  });
};

exports.deleteName = function(req,res) {
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

exports.deleteContact = function(req,res) {
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

exports.deleteLink = function(req, res) {
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

exports.deleteJob = function(req, res) {
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






// exports.follow = function(req,res) {
//   logger.info('Person controller: Follow person.');
//   logger.info(req.body);
//   // First find the person
//   models.person.findById(req.body.person_id).then(function(person) {
//     // then find the account
//     models.account.findById(req.body.account_id).then(function(account) {
//       if (account){
//         person.addFollower(account).then(function(result) {
//
//           // stream.follow({
//           //   user_id: req.body.account_id,
//           //   follower_type: 'person',
//           //   follower_id: req.body.person_id,
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
//   // first find the person
//   models.person.findById(req.body.person_id).then(function(person) {
//     if (person) {
//       // then find the account
//       models.account.findById(req.body.account_id).then(function(account) {
//         if (account){
//           person.removeFollower(account).then(function(result){
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
// // person editors
// exports.addEditor = function(req,res) {
//   logger.info('adding editor');
//   models.person.findById(req.params.id).then(function(person) {
//     if (!person) { return res.json(person); }
//     // If role is owner, check if one does not exist already
//     // person.getEditors().then(function(result) {
//     //   logger.info(result);
//     //
//     // });
//     models.account.findById(req.body.account_id).then(function(account) {
//       if (!account) { return res.json(account); }
//       person.addEditor(account, {role: req.body.role}).then(function(result) {
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
