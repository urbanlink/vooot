'use strict';

var express = require('express');
var router = express.Router();

var acl = require('../permissions');
var validator = require('../validators');
var controller = require('../controllers');


module.exports = function(app){

  router.get('/',           acl.canView,   controller.membership.index );
  router.get('/role-types', acl.canView,   controller.membership.roleTypes );
  router.get('/:id',        acl.canView,   controller.membership.show );
  router.post('/',          acl.canCreate, controller.membership.create );
  router.put('/:id',        acl.canUpdate, controller.membership.update );
  router.delete('/:id',     acl.canDelete, controller.membership.delete );

  app.use('/membership', router);
};
