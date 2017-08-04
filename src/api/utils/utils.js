'use strict';

var logger = require('../../config/logger');


// handle return error
exports.handleError = function(res,err) {
  logger.debug('Error: ', err);
  return res.status(500).json({status:'error', msg:err});
};
