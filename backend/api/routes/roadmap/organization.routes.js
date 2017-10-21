'use strict';

var express = require('express');
var router = express.Router();
var controller = require('../controllers/organization.controller');
var permissions = require('../permissions/organization.permissions');


module.exports = function(app) {

  router.get('/',
    permissions.canView,
    controller.index
  );
  router.get('/query',
    permissions.canView,
    controller.query
  );
  router.get('/:id',
    permissions.canView,
    controller.show
  );
  router.post('/',
    permissions.canCreate,
    controller.create
  );
  router.put('/:id',
    permissions.canUpdate,
    controller.update
  );
  router.delete('/:id',
    permissions.canDelete,
    controller.destroy
  );


  // Follow and unfollow an organization by an account
  router.post('/:id/follow',
    permissions.canUpdate,
    controller.follow
  );

  router.post('/:id/unfollow',
    permissions.canUpdate,
    controller.unfollow
  );


  router.post('/:id/editor',
    permissions.canUpdate,
    controller.addEditor
  );
  router.post('/:id/image',
    permissions.canUpdate,
    controller.addImage
  );
  router.post('/:id/person',
    permissions.canUpdate,
    controller.addPerson
  );

  router.delete('/:id/editor',
    permissions.canUpdate,
    controller.deleteEditor
  );
  router.delete('/:id/person',
    permissions.canUpdate,
    controller.deletePerson
  );


  app.use('/organization', router);
};
