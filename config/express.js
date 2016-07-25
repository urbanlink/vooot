'use strict';

// var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');
var settings = require('./settings');
var cors = require('cors');
var logger = require('winston');
var jwt = require('./../api/middleware/jwt.service');
var helmet = require('helmet');


module.exports = function(app) {
  var env = settings.environment;

  app.use(compression());
  // parse application/x-www-form-urlencoded
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(methodOverride());
  app.use(cors());
  //app.use(cookieParser());
  app.use(helmet());
  
  // Validate the JWT for every request.
  app.use(function (req, res, next) {
    jwt.decode(req, function(result) {
      next();
    });
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
};
