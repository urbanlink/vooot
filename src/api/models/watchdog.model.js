'use strict';

module.exports = function(sequelize, DataTypes) {

  var Watchdog = sequelize.define('watchdog', {

    //The category to which this message belongs. Can be any string, but the general practice is to use the name of the module calling
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },

    //The message to store in the log. Keep $message translatable by not concatenating dynamic values into it! Variables in the message should be added by using placeholder strings alongside the variables argument to declare the value of the placeholders. See t() for documentation on how $message and $variables interact.
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    // Array of variables to replace in the message on display or NULL if message is already translated or not possible to translate.
    variables: {
      type: DataTypes.TEXT,
    },

    // The severity of the message; one of the following values as defined in RFC 3164:
    /*
    EMERGENCY: Emergency, system is unusable.
    ALERT: Alert, action must be taken immediately.
    CRITICAL: Critical conditions.
    ERROR: Error conditions.
    WARNING: Warning conditions.
    NOTICE: (default) Normal but significant conditions.
    INFO: Informational messages.
    DEBUG: Debug-level messages.
    */
    severity: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return Watchdog;
};
