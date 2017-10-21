'use strict';

var fs = require('fs');
var path = require('path');
var logger = require('../../config/logger');

var validators = {
  // Validate if all query parameters are integers
  areParamsInt: function(req,res,next) {
    for (var param in req.params) {
      req.checkParams(param, 'Invalid URL parameter.').isInt();
    }
    req.getValidationResult().then(function(result) {
      if (!result.isEmpty()) {
        return res.json(result.array());
      }
      next();
    });
  }
};

// Attach specific permission files
fs.readdirSync(__dirname).filter(function(file) {
  return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
}).forEach(function(file) {
  var name = file.split('.')[0];
  var validator = require(path.join(__dirname, file));
  validators[ name] = validator;
});

module.exports = validators;
