'use strict';

var cronEvent = require('../cronjobs/events');

module.exports.crontab = {

  '* * * * * *': cronEvent.syncEvents




   // Every 1 minutes
  //  '* * * * * *': function cleandb() {
  //      console.log('cleandb');
  //   }
};
