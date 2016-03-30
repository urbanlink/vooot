/**
 * schedule hook
 */

module.exports = function (sails) {

  var schedule = require('node-schedule');

  return {
    // Run when sails loads-- be sure and call `next()`.
    initialize: function (next) {
      sails.after('hook:orm:loaded', function () {
        Object.keys(sails.config.crontab).forEach(function(key) {
          var val = sails.config.crontab[key];
          console.log('scheduling job ', key, val);
          schedule.scheduleJob(key, val);
        });
      });
      return next();
    }
  };
};
