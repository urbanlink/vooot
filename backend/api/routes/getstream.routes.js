'use strict';

var express = require('express');
var router = express.Router();

// var permission = require('../permissions/getstream.permissions');
var getStreamCtrl = require('../controllers/getstream.controller');

module.exports = function(app){

  router.get('/flat', getStreamCtrl.getFeed);
  router.post('/token', getStreamCtrl.getReadOnlyToken);
  router.post('/activity', getStreamCtrl.createActivity);
  router.post('/follow', getStreamCtrl.follow);
  router.post('/unfollow', getStreamCtrl.unfollow);

  // Add the person endpoint to the router.
  app.use('/getstream', router);

};
