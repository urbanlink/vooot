'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var settings = require('./config/settings');
var logger = require('winston');
var express = require('express');
var app = express();

// Setup logging
require('./config/logger').logger(app);

// Setup express
var server = require('http').createServer(app);
require('./config/express')(app);

// Setup models
require('./api/models');

// Setup routes
require('./api/routes')(app);

// Initiate cron
require('./config/cron')(app);
//require('./bin/db/seed');

server.listen(settings.port, settings.ip, function () {
  require('./bin/db/seed').organizations();
  logger.debug('Express server listening on %d, in %s mode', settings.port, settings.environment);
});

// Expose app
module.exports = app;
