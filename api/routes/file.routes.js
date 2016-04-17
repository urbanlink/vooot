'use strict';

var express = require('express');
var router = express.Router();
var fileCtrl = require('../controllers/file.controller');
var filePermissions = require('../permissions/file.permissions');

module.exports = function(app){

  router.get('/',
    filePermissions.canView,
    fileCtrl.index
  );

  router.get('/:id',
    filePermissions.canView,
    fileCtrl.show
  );

  router.get('/:id/sync',
    filePermissions.canUpdate,
    fileCtrl.syncFile
  );

  // router.post('/',
  //   filePermissions.canCreate,
  //   fileCtrl.create
  // );
  // router.put('/:id',
  //   filePermissions.canUpdate,
  //   fileCtrl.update
  // );
  // router.delete('/:id',
  //   filePermissions.canDelete,
  //   fileCtrl.destroy
  // );


  app.use('/file', router);
};
