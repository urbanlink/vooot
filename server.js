/* globals require, process, module */

'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var settings = require('./config/settings');
var logger = require('winston');
var express = require('express');
var moment = require('moment');
var app = express();
var Watchdog = require('./api/controllers/watchdog.controller');

// Setup logging
require('./config/logger').logger(app);


// Setup express
var server = require('http').createServer(app);
require('./config/express')(app);

// Setup Socket.io
require('./config/socket')(server);

// Setup routes
require('./api/routes')(app);


// Setup models
var db = require('./api/models');

if (process.env.SYNCDB === 'true') {
  // Synchronize all models.
  db.sequelize.sync({force: true}).then(function(result){
    var dbseed = require('./bin/db/seed');
    // Create the organizations from almanak.
    dbseed.organizations(function(result) {
      // Create the persons from almanak
      dbseed.persons(function(result) {
        // Initiate the cron
        require('./bin/cron/events').syncEvents();
        // Start the server
        start();
      });
    });
  });
} else {
  start();
}

function start() {
  server.listen(settings.port, settings.ip, function () {
    logger.debug('Express server listening on %d, in %s mode', settings.port, settings.environment);
    Watchdog.add('system', 'NOTICE', 'Express server started. ');
  });
}

// Initiate cron
//require('./config/cron')(app);



// Expose app
module.exports = app;
