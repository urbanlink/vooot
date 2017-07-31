'use strict';

var jwt = require('jwt-simple');
var settings = require('../../config/settings');
var moment = require('moment');
var request = require('request');

// Decode the token if present and add it to req
exports.decode = function(req, next) {
  req.jwt = {};
  if (req.headers.authorization){
    var token = req.headers.authorization.split(' ')[1];
    try {
      var payload = jwt.decode(token, settings.jwt.secret, 'base64');
      if ( (payload.exp) && (payload.exp > moment().unix()) ) {
        req.jwt = payload;
      }
    } catch (err) {
      console.log('Error decoding token: ', err);
    }
  }
  // Always proceed
  next();
};
