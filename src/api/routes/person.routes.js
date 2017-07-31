'use strict';

var express = require('express');
var router = express.Router();
var controller = require('../controllers/person.controller');
var permission = require('../permissions/person.permissions');

module.exports = function(app){

  router.get('/',
    permission.canView,
    controller.index
  );

  router.get('/query',
    permission.canView,
    controller.query
  );

  router.get('/:id',
    permission.canView,
    controller.show
  );

  router.post('/follow',
    permission.canUpdate,
    controller.follow
  );

  router.post('/unfollow',
    permission.canUpdate,
    controller.unfollow
  );

  router.post('/:id/editor',
    permission.canUpdate,
    controller.addEditor
  );

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

  router.post('/:id/identifier',
    permission.canUpdate,
    controller.addIdentifier
  );
  router.delete('/:id/identifier',
    permission.canUpdate,
    controller.removeIdentifier
  );

  app.use('/person', router);
};
