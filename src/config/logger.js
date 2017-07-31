var fs = require('fs');
var path = require('path');
var winston = require('winston');
var logDir = path.join(__dirname, '../logs');
winston.emitErrs = true;
winston.setLevels(winston.config.syslog.levels);

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

var logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: path.join(__dirname, '../logs/all.log'),
      json: true,
      maxsize: 5242880, //5MB
      maxFiles: 100,
      colorize: false
    }),
    new winston.transports.Console({
      level: 'debug',
      json: false,
      colorize: true,
      timestamp: true
    })
  ],
  exceptionHandlers: [
    new winston.transports.Console({ json: false, timestamp: true }),
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/exceptions.log'),
      json: false
    })
  ],
  exitOnError: false
});

module.exports = logger;
module.exports.stream = {
  write: function(message, encoding){
    logger.info(message);
  }
};


// TODO: Send a mail on app crash.
