'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var logger = require('./config/logger');
logger.info('Logger initiated');
var settings = require('./config/settings');
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

// if (process.env.SYNCDB === 'true') {
//   // Synchronize all models.
//   db.sequelize.sync({force: true}).then(function(result){
//     var dbseed = require('./bin/db/seed');
//     // Create the organizations from almanak.
//     dbseed.organizations(function(result) {
//       // Create the persons from almanak
//       dbseed.persons(function(result) {
//         // Initiate the cron
//         require('./bin/cron/events').syncEvents();
//         // Start the server
//         start();
//       });
//     });
//   });
// } else {
//   start();
// }

function start() {
  server.listen(settings.port, settings.ip, function () {
    logger.info('Express server listening on %d, in %s mode', settings.port, settings.environment);
  });
}

start();
