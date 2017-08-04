'use strict';

var settings = require('./config/settings');
var env = settings.env || 'development';

// Initiate logger
var logger = require('./config/logger');
logger.info('Logger initiated');

// Setup Express app
var express = require('express');
var app = express();

// Setup express
var server = require('http').createServer(app);
logger.info('Setting up express');
require('./config/express')(app);

// Setup routes
logger.info('Setting up Routes');
require('./api/routes')(app);

// Setup models
logger.info('Setting up database and models');
var db = require('./api/models');

// Start the server
server.listen(settings.port, settings.ip, function () {
  logger.info('Express server listening on %d, in %s mode', settings.port, settings.environment);
});
