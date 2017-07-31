'use strict';

var models = require('../models/index');
var settings = require('../../config/settings');
var path = require('path');
var logger = require('winston');
// var stream = require('./stream.controller');


// error handler
function handleError(res, err) {
  logger.debug('Error: ', err);
  return res.status(500).json({status:'error', msg:err});
}


// File index
exports.index = function(req,res) {

  var limit = parseInt(req.query.limit) || 10;
  if (limit > 50) { limit = 50; }
  var offset = parseInt(req.query.offset) || 0;
  var order = req.query.order || 'created_at DESC';
  var filter = {};

  // Only fetch the persons the current user is following (if requested)
  if (req.query.following === 'true') {
    logger.debug('Fetching persons user is following. ');
    logger.debug(req.jwt.vooot_id);
    if (!req.jwt || !req.jwt.vooot_id) {
      return res.json({error: 'No vooot id provided.'});
    }
    models.account.findById(req.jwt.vooot_id).then(function(account) {
      if (!account) { res.json(account); }
      account.getAccounts().then(function(result) {
        return res.json({rows: result});
      }).error(function(error) {
        return handleError(res,error);
      });
    }).error(function(error) {
      return handleError(res,error);
    });

  } else if (req.query.editor === 'true') {
    logger.debug('Fetching persons user is following. ');
    logger.debug(req.jwt.vooot_id);
    if (!req.jwt || !req.jwt.vooot_id) {
      return res.json({error: 'No vooot id provided.'});
    }
    models.account.findById(req.jwt.vooot_id).then(function(account) {
      if (!account) { res.json(account); }
      account.getPersons().then(function(result) {
        return res.json({rows: result});
      }).error(function(error) {
        return handleError(res,error);
      });
    }).error(function(error) {
      return handleError(res,error);
    });

  } else {
    models.person.findAndCountAll({
      where: filter,
      limit: limit,
      offset: offset,
      order: order
    }).then(function(result) {
      return res.json(result);
    }).catch(function(err){
      return res.json({err:err});
    });
  }
};


// Show a single file
exports.show = function(req,res) {
  models.person.findOne({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: models.account,
        as: 'followers',
        through: 'person_followers',
        attributes: ['name', 'picture', 'id']
      },
      {
        model: models.account,
        as: 'editors',
        through: 'person_editors',
        attributes: ['name', 'picture', 'id']
      },
      {
        model: models.identifier,
        as: 'identifiers',
        foreignKey: 'person_id',
        attributes: ['scheme', 'identifier']
      },
      {
        model: models.organization,
        as: 'memberships',
        through: 'membership'
      },
    ]
  }).then(function(event){
    return res.json(event);
  }).catch(function(error) {
    return handleError(res,error);
  });
};


// Create a file
exports.create = function(req,res){
  models.person.create(req.body).then(function(result) {
    return res.json(result);
  }).catch(function(err) {
    return handleError(res,err);
  });
};


// Update a file record
exports.update = function(req,res) {
  console.log('Updating person ' + req.params.id);
  models.person.update(req.body, {
    where: { id: req.params.id }
  }).then(function(result) {
    console.log('done');
    return res.json(result);
  }).catch(function(err){
    return handleError(res,err);
  });
};


// Delete a file record
exports.destroy = function(req,res){
  models.person.destroy({
    where: { id: req.params.id }
  }).then(function(result){
    return res.json(result);
  }).catch(function(err){
    return handleError(res,err);
  });
};


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

exports.follow = function(req,res) {
  console.log('Person controller: Follow person.');
  console.log(req.body);
  // First find the person
  models.person.findById(req.body.person_id).then(function(person) {
    // then find the account
    models.account.findById(req.body.account_id).then(function(account) {
      if (account){
        person.addFollower(account).then(function(result) {

          // stream.follow({
          //   user_id: req.body.account_id,
          //   follower_type: 'person',
          //   follower_id: req.body.person_id,
          //   insertId: 1,
          //   created_at: new Date()
          // }, function(result) {
          //   console.log(result);
          // });

          return res.json(result);
        }).catch(function(error){
          return handleError(res,error);
        });
      } else {
        return handleError(res,'Account not found');
      }
    });
  }).catch(function(error) {
    return handleError(error);
  });
};

exports.unfollow = function(req,res) {
  // first find the person
  models.person.findById(req.body.person_id).then(function(person) {
    if (person) {
      // then find the account
      models.account.findById(req.body.account_id).then(function(account) {
        if (account){
          person.removeFollower(account).then(function(result){
            return res.json(result);
          }).catch(function(error){
            return handleError(res, error);
          });
        } else {
          return handleError(res,'Account not found');
        }
      });
    }
  }).catch(function(error) {
    return handleError(error);
  });
};


// person editors
exports.addEditor = function(req,res) {
  console.log('adding editor');
  models.person.findById(req.params.id).then(function(person) {
    if (!person) { return res.json(person); }
    // If role is owner, check if one does not exist already
    // person.getEditors().then(function(result) {
    //   console.log(result);
    //
    // });
    models.account.findById(req.body.account_id).then(function(account) {
      if (!account) { return res.json(account); }
      person.addEditor(account, {role: req.body.role}).then(function(result) {
        //logger.debug(result);
        return res.json(result);
      }).catch(function(error) {
        return handleError(res,error);
      });
    }).catch(function(error) {
      return handleError(res,error);
    });
  }).catch(function(error) {
    return handleError(res,error);
  });
};

exports.addIdentifier = function(req,res) {
  console.log(req.body.identifier);
  models.person.findById(req.params.id).then(function(person){
    if (!person) { return res.json(person); }
    models.identifier.create({
      identifier: req.body.identifier.identifier,
      scheme: req.body.identifier.scheme,
      person_id: req.params.id
    }).then(function(result) {
      console.log(result);
      return res.json(result);
    }).catch(function(error) {
      return handleError(res,error);
    });
  }).catch(function(error) {
    return handleError(res,error);
  });
};

exports.removeIdentifier = function(req,res) {
  console.log(req.body.identifier);
  models.person.findById(req.params.id).then(function(person){
    if (!person) { return res.json(person); }
    models.identifier.destroy({
      where: {
        identifier: req.body.identifier.identifier,
        scheme: req.body.identifier.scheme,
        person_id: req.params.id
      }
    }).then(function(result) {
      console.log(result);
      return res.json(result);
    }).catch(function(error) {
      return handleError(res,error);
    });
  }).catch(function(error) {
    return handleError(res,error);
  });
};
