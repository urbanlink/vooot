'use strict';

var express = require('express');
var router = express.Router();
var organizationCtrl = require('../controllers/organization.controller');
var organizationPermissions = require('../permissions/organization.permissions');

module.exports = function(app){
  router.get('/',
    organizationPermissions.canView,
    organizationCtrl.index
  );
  router.get('/:id',
    organizationPermissions.canView,
    organizationCtrl.show
  );
  router.post('/',
    organizationPermissions.canCreate,
    organizationCtrl.create
  );
  router.put('/:id',
    organizationPermissions.canUpdate,
    organizationCtrl.update
  );
  router.delete('/:id',
    organizationPermissions.canDelete,
    organizationCtrl.destroy
  );


  app.use('/organization', router);
};
