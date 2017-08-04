'use strict';

exports.check = function(req,res,next) {
  console.log('Method: ' + req.method);
  console.log('Path: ' + req.path);
  next();
};
