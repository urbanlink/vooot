'use strict';

var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');
var cors = require('cors');
var logger = require('./logger');
var auth = require('./auth')();
var passport = require("passport");
var jwt = require('express-jwt');
var helmet = require('helmet');
var permissions = require('./../api/permissions');
console.log(permissions);
var settings = require('./settings');

module.exports = function(app) {
  logger.info('Initiating express.');
  var env = settings.environment;

  // Use helmet to secure Express headers
  var SIX_MONTHS = 15778476000;
  app.use(helmet.frameguard());
  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.use(helmet.hsts({maxAge: SIX_MONTHS, includeSubdomains: true, force: true}));
  app.disable('x-powered-by');

  // Enable body parsing
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Authenticate
  // app.use(jwt({
  //   secret: settings.jwt.secret,
  //   strict: true
  // })
  // .unless({
  //   path: [
  //     '/',
  //     '/account/login',
  //     { url: '/account', methods: ['POST']  },
  //     { url: '/person', methods: ['GET'] }
  //   ]
  // })
  // );

  // Validate permissions for each route request
  // app.use(permissions.check);

  // return error message for unauthorized requests
  app.use(function (err, req, res, next) {
    if (err) {
      logger.info('There was an error');
      logger.info(err.name);
    }
    if (err.name === 'UnauthorizedError') {
      return res.status(401).json({
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
