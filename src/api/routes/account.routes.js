'use strict';

var express = require('express');
var router = express.Router();
var permission = require('../permissions/account.permissions');
var controller = require('../controllers/account.controller');


module.exports = function(app){

  router.get('/:id',
    permission.canView,
    controller.show
  );

  router.post('/me',
    permission.canView,
    controller.me
  );

  // router.get('/',
  //   permission.canView,
  //   controller.index
  // );

  // router.post('/sync',
  //   permission.canCreate,
  //   controller.sync
  // );

  // router.put('/:id',
  //   permission.canUpdate,
  //   controller.update
  // );
  // router.delete('/:id',
  //   permission.canDelete,
  //   controller.destroy
  // );

  app.use('/account', router);
};
