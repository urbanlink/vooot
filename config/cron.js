'use strict';

var schedule = require('node-schedule');

module.exports = function() {

  // Sync all events for all organizations (daily).
  schedule.scheduleJob('0 0 * * *', require('./../bin/cron/events').syncEvents);

  // 

};
