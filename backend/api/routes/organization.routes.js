'use strict';

var express = require('express');
var router = express.Router();

var acl = require('../permissions');
var validator = require('../validators');
var controller = require('../controllers');


module.exports = function(app){

  router.get( '/', acl.canView, controller.organization.index );
  router.get( '/classifications', acl.canView, controller.organization.classifications );
  router.get( '/:organizationId', acl.canView, controller.organization.show );
  router.post('/', acl.canCreate, controller.organization.create );
  router.put('/:organizationId', acl.canUpdate, controller.organization.update );
  router.delete('/:organizationId', acl.canDelete, controller.organization.delete );

  app.use('/organization', router);
};
