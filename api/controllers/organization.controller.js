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
  var order = req.query.order || 'name ASC';
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

// Show a single organization
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
      },{
        // Followers
        model: models.account,
        as: 'followers',
        through: 'organization_followers',
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
        as: 'memberships',
        through: 'membership'
      }
    ],limit: 20
  }).then(function(organization) {

    // get feed
    // var stream = require('./stream.controller');
    // var orgStream = stream.instantiateFeed('timeline', req.user.dataValues.id);
    // console.log(orgStream);
    // TEST
    // Add an activity to the flat stream for this organization
    var stream = require('./stream.controller');
    var orgStream = stream.feed('organization', organization.dataValues.id);
    var activity = {
      actor: 'user:1',
      verb: 'view',
      object: 'organization:' + organization.dataValues.id
    };
    orgStream.addActivity(activity).then(function(data) {
      console.log(data);
    }).catch(function(error) {
      console.log(error);
    });

    // var activity = {"actor": "User:1", "verb": "watch", "object": "Organization:" + organization.dataValues.id, "target": "Board:1"};
    // orgStream.addActivity(activity).then(function(data) {
    //   /* on success */
    //   // console.log(data);
    //
    //   var timeline_1 = stream.feed('timeline', '1');
    //   timeline_1.follow('organization', organization.dataValues.id);
    //   // console.log(timeline_1);
    //
    //   timeline_1.get({'limit': 30}).then(function(result) {
    //     console.log(result);
    //   }).catch(function(error) {
    //     console.log(error);
    //   });
    //
    //
    // }).catch(function(reason) {
    //   /* on failure, reason.error contains an explanation */
    //   console.log(reason);
    // });

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
      { model: models.identifier, as: 'identifiers', attributes: ['scheme', 'identifier'] }
      // { model: models.image, as: 'logo' }
    ]
  }).then(function(result) {
    return res.json(result);
  }).catch(function(err) {
    return handleError(res,err);
  });
};


exports.follow = function(req, res) {
  // Fetch the organization
  models.organization.findById(parseInt(req.body.organization_id)).then(function(organization) {
    console.log(organization);
    // then find the account that will follow the organization
    models.account.findById(req.body.account_id).then(function(account) {
      if (account){
        organization.addFollower(account).then(function(result){

          var stream = require('./stream.controller');
          stream.follow({
            user_id: req.body.account_id,
            follower_type: 'organization',
            follower_id: req.body.organization_id,
            insertId: 1,
            created_at: new Date()
          });

          //var orgStream = stream.instantiateFeed('timeline', req.user.dataValues.id);
          // Let user's flat feed follow organization's feed
          // var userFeed = stream.feed('user', String(req.body.account_id));
          // console.log(userFeed);
          // userFeed.addActivity({
          //   actor: String(req.body.account_id),
          //   tweet: 'Hello world',
          //   verb: 'tweet',
          //   object: 1
          // });
          // var userFlatFeed = stream.instantiateFeed('timeline', String(req.body.account_id));
          // console.log(userFlatFeed);
          // stream.follow('organization', req.body.organization_id);

          // Add the
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
  models.organization.findById(req.body.organization_id).then(function(organization) {
    if (organization) {
      // then find the account
      models.account.findById(req.body.account_id).then(function(account) {
        if (account){
          organization.removeFollower(account).then(function(result){

            // remove from stream.io
            var stream = require('./stream.controller');
            var timeline_1 = stream.feed('timeline', req.body.account_id);
            timeline_1.unfollow('organization', organization.dataValues.id);
            // var stream = require('./stream.controller');
            //var orgStream = stream.instantiateFeed('timeline', req.user.dataValues.id);
            // Let user's flat feed follow organization's feed
            // var userFlatFeed = stream.instantiateFeed('user', req.body.account_id);
            // userFlatFeed.unfollow('organization', req.body.organization_id);

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
