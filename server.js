/* globals require, process, module */

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


// Setup routes
require('./api/routes')(app);


// Setup models
var db = require('./api/models');

if (process.env.SYNCDB === 'true') {
  db.sequelize.sync({force: true}).then(function(result){
    var dbseed = require('./bin/db/seed');
    dbseed.organizations(function(result) {
      require('./bin/cron/events').syncEvents();
    });
  });
}

server.listen(settings.port, settings.ip, function () {
  logger.debug('Express server listening on %d, in %s mode', settings.port, settings.environment);
});

// Initiate cron
//require('./config/cron')(app);



// Expose app
module.exports = app;
