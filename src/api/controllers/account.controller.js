'use strict';

var models = require('../models/index');
var settings = require('../../config/settings');
var logger = require('../../config/logger');
var utils = require('../utils');
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var mail = require('../../mail');


/********
 *
 * ACCOUNT REGISTRATION AND HELPER FUNCTIONS
 *
 ********/
// Register a new user account
exports.register = function(req,res,next) {
  // parse input
  var email = req.body.email;
  var password = req.body.password;
  if (!email || !password) {
    return res.json({error: "Please, fill in all the fields."});
  }

  // Create the hashed password and salt
  var salt = bcrypt.genSaltSync(10);
  var hashedPassword = bcrypt.hashSync(password, salt);

  // Create the new account object
  var newAccount = {
    email: email,
    salt: salt,
    password: hashedPassword,
    activationkey: utils.randomAsciiString(24),
    verified: false
  };
  // Save the new account
  models.account.create(newAccount).then(function(result) {
    // Send welcome mail
    mail.send({
      template: 'afterRegistration',
      to: email,
      key: newAccount.activationkey
    });
    // return result
    return res.json({ msg: 'Account created successfully. Mail with activation code sent by mail. '});
  }).catch(function(err) {
    // something went wrong, handle error
    utils.handleError(res,err);
  });
};

// Activate a user account based on activation key.
exports.activate = function(req,res,next) {
  var key = req.body.key;
  // find the user with the key
  models.account.findOne({
    where: {
      activationkey: key
    }
  }).then(function(result){
    if(!result) { return res.json({msg: 'Key not found. '}); }
    // key found, change verification status
    result.updateAttributes({
      verified: true,
      activationkey: null
    }).then(function(result) {
      if (result.dataValues.verified===true) {
        // send mail to the user
        mail.send({
          template: 'afterActivation',
          to: result.dataValues.email
        });
      }
      return res.json({ msg: 'Account activated. '});
    }).catch(function(err) {
      return res.json(err);
    });
  }).catch(function(err) {
    return res.json({msg: 'Error fetching key. '});
  });
};

// Send a new account activation key
exports.resendActivationKey = function(req,res,next) {
  var email = req.body.email;

  models.account.findOne({
    where: {
      email:email,
      verified: {
        $or: {
          $eq: null,
          $ne: 1
        }
      }
    }
  }).then(function(account){
    if (!account) {
      return res.json({msg: 'Did not find account that needs verification. '});
    }
    account.updateAttributes({
      activationkey: utils.randomAsciiString(24)
    }).then(function(result) {
      mail.send({
        template: 'resendActivationKey',
        to: account.dataValues.email,
        key: account.dataValues.activationkey
      });
      return res.json({msg: 'email with activation code send.'});
    });
  }).catch(function(err) {
    utils.handleError(res,err);
  });
};

//
exports.forgotPassword = function(req,res,next) {
  var email = req.body.email;
  // find the user with the key
  models.account.findOne({
    where: {
      email: email
    }
  }).then(function(account) {
    if(!account) { return res.json({msg: 'Account not found. '}); }
    // key found, update resetpasswordkey
    account.updateAttributes({
      resetpasswordkey: utils.randomAsciiString(40)
    }).then(function(result) {
      // send mail to the user
      mail.send({
        template: 'forgotPassword',
        to: result.dataValues.email,
        key: result.dataValues.resetpasswordkey
      });
      return res.json(true);
    }).catch(function(err) {
      return res.json(err);
    });
  }).catch(function(err) {
    return res.json({msg: 'Error fetching key. '});
  });
};

//
exports.changePassword = function(req, res, next) {
  // validate input
  var email = req.body.email;
  var key = req.body.key;
  var password = req.body.password;
  // find account
  models.account.findOne({where: {
    email:email,
    resetpasswordkey:key
  }}).then(function(account) {
    if (!account) { return res.json({msg: 'Account not found. '}); }
    // Create the hashed password and salt
    var salt = bcrypt.genSaltSync(10);
    var hashedPassword = bcrypt.hashSync(password, salt);
    account.updateAttributes({
      resetpasswordkey: null,
      salt: salt,
      password: hashedPassword
    }).then(function(result) {
      mail.send({
        template: 'afterPasswordChanged',
        to: email
      });
      return res.json(true);
    }).catch(function(err) {
      utils.handleError(res,err);
    });
  }).catch(function(err) {
    utils.handleError(res,err);
  });
};


/********
 *
 * ROLE FUNCTIONS
 *
 ********/
// Send a list of account role types (id's and value).
exports.roleTypes = function(req, res, next) {
  return res.json({
    accountRoles: {
      1: 'administrator',
      2: 'editor'
    }
  });
};

// Add a role to a user account
exports.addRole = function(req, res, next) {
  models.account.findById(req.user.id).then(function(account) {
    if (!account) { return res.json({msg: 'Account not found. Association not created. '}); }
    models.account_role_type.findById(req.body.role_id).then(function(role) {
      if (!role) { return res.json({msg: 'Role not found. Association not created. '}); }
      // console.log(role);
      account.addRole().then(function(result) {
        console.log(result);
        return res.json(result);
      }).catch(function(err){
        console.log('errr', err);
        utils.handleError(res,err);
      });
    }).catch(function(err) {
      utils.handleError(res,err);
    });
  });
};

// Delete a role from a user account
exports.deleteRole = function(req,res,next) {
  models.account_role.destroy({ where: { account_id: req.user.id, role_id: req.body.role_id } }).then(function(result) {
    return res.json(result);
  }).catch(function(err){
    return res.json(err);
  });
};



/********
 *
 * PROFILE FUNCTIONS
 *
 ********/
// Get account and profile of current uer
exports.me = function(req,res,next) {
  if (req.user && req.user.id) {

    models.account.findOne({
      where: {
        id: req.user.id
      },
      attributes: ['id', 'email', 'picture', 'name'],
      // include roles
      include: [{
        model: models.account_role,
        as: 'roles',
        attributes: ['type_id']
      }]
    }).then(function(result) {

      // add user_id and client_id to the request header
      var account = result.dataValues;
      account.profile = {
        picture: account.picture,
        name: account.name
      };
      delete account.picture;
      delete account.name;

      var roles = account.roles;
      account.roles = [];

      req.user = {};
      for (var i=0; i<roles.length;i++) {
        account.roles.push(roles[ i].dataValues.type_id);
      }

      return res.json(account);
    }).catch(function(err) {
      return res.json(err);
    });
  }
  else {
    return res.json({msg: 'Account not found.'});
  }
};
