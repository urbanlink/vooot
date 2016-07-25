'use strict';

var models = require('../models/index');
var Watchdog = require('./watchdog.controller');
var logger = require('winston');

// error handler
function handleError(res, err) {
  console.log('Error: ', err);
  return res.status(500).json({status:'error', msg:err});
}


// Organization index
exports.index = function(req,res) {
  var limit = parseInt(req.query.limit) || 10;
  if (limit > 50) { limit = 50; }
  var offset = parseInt(req.query.offset) || 0;
  var order = req.query.order || 'created_at DESC';
  var filter = {};

  models.organization.findAndCountAll({
    where: filter,
    limit: limit,
    offset: offset,
    order: order,
    include: [
      { model: models.identifier, as: 'identifiers', attributes: ['scheme', 'identifier'] },
      // { model: models.image, as: 'logo' }
    ]
  }).then(function(result) {
    return res.json(result);
  }).catch(function(err) {
    return handleError(res,err);
  });

};

exports.show = function(req,res) {

  models.organization.findOne({
    where: { id: req.params.id },
    include: [
      {
        // Events
        model: models.event,
        as: 'events',
        limit: 10,
        where: {
          start_date: {
            $gte: new Date()
          }
        },
        order: 'start_date ASC'
      },{
        // Editors
        model: models.account,
        as: 'editors',
        through: 'organization_editors',
        attributes: ['name', 'picture', 'id']
      },
      // Images
      // { model: models.image, as: 'logo'}, 
      {
        // attributes
        model: models.identifier, as: 'identifiers', attributes: ['scheme', 'identifier']
      }, {
        // Persons
        model: models.person,
        as: 'persons',
        through: 'organization_persons'
      }
    ]
  }).then(function(organization) {
    // organization.getEvents({
    //   limit: 10,
    //   where: {
    //     start_date: {
    //       $gte: new Date()
    //     }
    //   },
    //   order: 'start_date ASC'
    // }).then(function(result) {
    //   organization.dataValues.events = result;
      return res.json(organization);
    }).catch(function(error) {
      return handleError(res,error);
    });
  // });
};

exports.create = function(req,res) {
  console.log('Creating new organization: ', req.body.name);
  models.organization.create(req.body).then(function(result) {
    // Watchdog.add('organization', 'NOTICE', 'New organisation created.', { id: result.id });
    console.log('Organization created: ' + result.id);
    return res.json(result);
  }).catch(function(err) {
    handleError(res,err);
  });
};

exports.update = function(req,res){
  models.organization.update(req.body, {
    where: { id: req.params.id }
  }).then(function(result){
    return res.json(result);
  }).catch(function(err){
    handleError(res,err);
  });
};

exports.destroy = function(req,res){
  models.organization.destroy({
    where: { id: req.params.id }
  }).then(function(result){
    return res.json(result);
  }).catch(function(err){
    handleError(res,err);
  });
};


exports.query = function(req,res) {
  var limit = parseInt(req.query.limit) || 10;
  if (limit > 50) { limit = 50; }
  var offset = parseInt(req.query.offset) || 0;
  var order = req.query.order || 'created_at DESC';
  var filter = {
    classification: req.query.classification,
    name: {
      $like: '%' + String(req.query.term) + '%'
    }
  };
  models.organization.findAndCountAll({
    where: filter,
    limit: limit,
    offset: offset,
    order: order,
    include: [
      { model: models.identifier, as: 'identifiers', attributes: ['scheme', 'identifier'] },
      { model: models.image, as: 'logo' }
    ]
  }).then(function(result) {
    return res.json(result);
  }).catch(function(err) {
    return handleError(res,err);
  });
};

// organization editors
exports.addEditor = function(req,res) {

  models.organization.findById(req.params.id).then(function(organization) {
    if (!organization) { return res.json(organization); }
    models.account.findById(req.body.account_id).then(function(account) {
      if (!account) { return res.json(account); }
      organization.addEditor(account, {role: 'editor'}).then(function(result) {
        logger.debug(result);
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

exports.deleteEditor = function(req,res) {


};

exports.addImage = function(req,res) {
  models.organization.findById(req.params.id).then(function(organization) {
    if (!organization) { return res.json(organization); }
    models.image.create(req.body).then(function(image) {
      console.log(image);
      organization.setLogo(image).then(function(result) {
        console.log(result);
        return res.json(result);
      }).catch(function(error) {
        return handleError(res,error);
      });
    }).catch(function(error) {
      return handleError(res,error);
    });
  });
};

// organization editors
exports.addPerson = function(req,res) {

  models.organization.findById(req.params.id).then(function(organization) {
    if (!organization) { return res.json(organization); }
    models.person.findById(req.body.person_id).then(function(person) {
      if (!person) { return res.json(person); }
      organization.addPerson(person, {role: 'member'}).then(function(result) {
        logger.debug(result);
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

exports.deletePerson = function(req,res) {


};
