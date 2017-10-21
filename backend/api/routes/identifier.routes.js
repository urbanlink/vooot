'use strict';

var express = require('express');
var router = express.Router();

var permission = require('../permissions/identifier.permissions');
var identifierCtrl = require('../controllers/identifier.controller');


module.exports = function(app){

  router.get( '/types', identifierCtrl.types );
  router.post('/',                permission.canCreate, identifierCtrl.create );
  router.put('/:identifierId',    permission.canUpdate, identifierCtrl.update );
  router.delete('/:identifierId', permission.canDelete, identifierCtrl.delete );

  // Add the person endpoint to the router.
  app.use('/identifier', router);

};
