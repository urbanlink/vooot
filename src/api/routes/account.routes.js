'use strict';

var express = require('express');
var router = express.Router();
var permission = require('./../permissions/account.permissions');
var controller = require('./../controllers/account.controller');
var auth = require('../../config/auth');
var passport = require('passport');

module.exports = function(app){

  // create a new account
  router.post('/register',
    controller.register
  );

  // send username and password to receive accesstoken and refreshtoken
  router.post('/login',
    // First try to authenticate using passport
    function(req,res,next) {
      passport.authenticate('local', {
        session: false
      }, function(err, account,info){
        if (err) { return res.json(err); }
        req.user = account;
        console.log(info);
        next();
        // next();
      })(req,res,next);
    },
    // auth.authenticate,
    // auth.serializeUser,
    auth.serializeClient,
    auth.generateAccessToken,
    auth.generateRefreshToken,
    function(req,res) {
      return res.json({
        user: req.user,
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
        token: req.token
      });
    }
  );

  router.post('/token/reject', auth.rejectToken);

  // activate
  router.post('/activate', controller.activate);
  router.post('/activate/resend', controller.resendActivationKey);
  router.post('/forgot-password', controller.forgotPassword);
  router.post('/change-password', controller.changePassword);


  app.use('/account', router);
};
