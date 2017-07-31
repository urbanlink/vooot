'use strict';

// var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');
var settings = require('./settings');
var cors = require('cors');
var logger = require('./logger');
var auth = require('./auth')();
var passport = require("passport");
var jwt = require('express-jwt');

module.exports = function(app) {
  logger.info('Initiating express.');
  var env = settings.environment;

  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cors());

  app.use(jwt({
    secret: settings.jwt.secret,
  }).unless({
    path: [
      '/',
      '/account/login',
      { url: '/account', methods: ['POST']  }
    ]
  }));

  // return error message for unauthorized requests
  app.use(function (err, req, res, next) {
    console.log(err);
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({
        message: err.message,
        code: err.code,
        status: err.status
      });
    }
  });

  if ('production' === env) {
    //app.use(express.static(path.join(settings.root, 'public')));
    //app.set('appPath', settings.root + '/public');
  }

  if ('development' === env || 'test' === env) {
    //app.use(require('connect-livereload')());
    //app.use(express.static(path.join(config.root, '.tmp')));
    //app.use(express.static(path.join(config.root, 'client')));
    //app.set('appPath', 'client');
    app.use(errorHandler()); // Error handler - has to be last
  }

  logger.info('Express initiated.');
};
