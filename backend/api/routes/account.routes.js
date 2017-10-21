'use strict';

var express = require('express');
var router = express.Router();
var passport = require('passport');

var auth = require('../../config/auth');
var acl = require('./../permissions');
var validator = require('../validators');
var controller = require('./../controllers');



module.exports = function(app){

  // create a new account
  router.post('/register',
    controller.account.register
  );

  // send username and password to receive accesstoken and refreshtoken
  router.post('/login',
    // First try to authenticate using passport
    function(req,res,next) {
      console.log('req.body:', req.body);
      passport.authenticate('local', {
        session: false
      }, function(err, account){
        if (err) { return res.status(403).json(err); }
        if (!account) { return res.status(403).json('Account not found. '); }
        req.user = account;
        console.log(account);
        next();
      })(req,res,next);
    },
    auth.serializeClient,
    auth.generateAccessToken,
    auth.generateRefreshToken,
    function(req,res) {
      return res.json({
        account: req.user,
        token: req.token
      });
    }
  );

  // Request a new access token by supplying a refreshtoken
  router.post('/token',
    auth.validateRefreshToken,
    auth.generateAccessToken,
    function(req,res) {
      res.status(201).json({
        token: req.token,
        user: req.user
      });
    }
  );

  router.post('/token/reject', auth.rejectToken);

  // activate
  router.post('/activate', controller.account.activate);
  router.post('/activate/resend', controller.account.resendActivationKey);
  router.post('/forgot-password', controller.account.forgotPassword);
  router.post('/change-password', controller.account.changePassword);

  // Account roles
  router.get( '/role-types', controller.account.roleTypes );
  router.post( '/:accountId/role',
    validator.areParamsInt,
    validator.account.isRoleInt,
    acl.account.canUpdate,
    controller.account.addRole
  );
  router.delete( '/:accountId/role',
    validator.areParamsInt,
    acl.account.canUpdate,
    controller.account.deleteRole
  );

  router.post('/me',
    controller.account.me
  );

  app.use('/account', router);
};
