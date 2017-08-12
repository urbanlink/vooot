'use strict';

var moment = require('moment');
var models = require('../models/index');
var settings = require('../../config/settings');
var logger = require('../../config/logger');

exports.validDates = function(req,res,next) {

  var startdate = moment.utc(req.body.startdate, 'x');
  var enddate = moment.utc(req.body.enddate, 'x');

  if (
    (startdate) &&
    (startdate.isValid()) &&
    (startdate.isAfter('2010-01-01')) &&
    (startdate.isBefore('2020-01-01')) ) {
      if (
        (enddate) &&
        (enddate.isValid()) &&
        (enddate.isAfter('2010-01-01')) &&
        (enddate.isBefore('2020-01-01')) ) {
          return next();
      }
  }

  return res.json({ msg: 'Not a valid timestamp. '});
};
