'use strict';

var express = require('express');
var router = express.Router();
var eventCtrl = require('../controllers/event.controller');
var eventPermissions = require('../permissions/event.permissions');

module.exports = function(app){
  router.get('/',
    eventPermissions.canView,
    eventCtrl.index
  );
  router.get('/:id',
    eventPermissions.canView,
    eventCtrl.show
  );
  router.post('/',
    eventPermissions.canCreate,
    eventCtrl.create
  );
  router.put('/:id',
    eventPermissions.canUpdate,
    eventCtrl.update
  );
  router.delete('/:id',
    eventPermissions.canDelete,
    eventCtrl.destroy
  );

  router.post('/sync',
    eventPermissions.canUpdate,
    eventCtrl.sync
  );

  app.use('/event', router);
};
