'use strict';

var express = require('express');
var router = express.Router();
var watchdogCtrl = require('../controllers/watchdog.controller');
var watchdogPermissions = require('../permissions/watchdog.permissions');

module.exports = function(app){

  router.get('/',
    watchdogPermissions.canView,
    watchdogCtrl.index
  );

  router.get('/:id',
    watchdogPermissions.canView,
    watchdogCtrl.show
  );

  app.use('/watchdog', router);
};
