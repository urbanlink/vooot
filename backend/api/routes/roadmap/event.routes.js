'use strict';

var express = require('express');
var router = express.Router();
var controller = require('../controllers/event.controller');
var permission = require('../permissions/event.permissions');

module.exports = function(app){

  router.get('/',
    permission.canView,
    controller.index
  );

  router.get('/sync',
    //permission.canEdit,
    controller.syncEvents
  );

  router.get('/:id',
    permission.canView,
    controller.show
  );

  router.get('/:id/sync',
    //permission.canEdit,
    controller.syncEvent
  );

  router.post('/:id/follow',
    permission.canUpdate,
    controller.follow
  );
  router.post('/:id/unfollow',
    permission.canUpdate,
    controller.unfollow
  );

  // router.post('/:id/identifier',
  //   permission.canUpdate,
  //   controller.addIdentifier
  // );
  // router.delete('/:id/identifier',
  //   permission.canUpdate,
  //   controller.removeIdentifier
  // );

  router.post('/',
    permission.canCreate,
    controller.create
  );

  router.put('/:id',
    permission.canUpdate,
    controller.update
  );

  router.delete('/:id',
    permission.canDelete,
    controller.destroy
  );

  app.use('/event', router);
};
