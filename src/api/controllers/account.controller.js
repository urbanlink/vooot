'use strict';

var models = require('../models/index');
var settings = require('../../config/settings');
var logger = require('../../config/logger');
var utils = require('../utils');
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var mail = require('../../mail');

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
    return res.json(result);
  }).catch(function(err) {
    // something went wrong, handle error
    utils.handleError(res,err);
  });
};

// Activate a user account based on activation key.
exports.activate = function(req,res,next) {
  var key = req.query.key;
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
      return res.json(result);
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
