'use strict';

var express = require('express');
var router = express.Router();

var permission = require('../permissions/link.permissions');
var linkCtrl = require('../controllers/link.controller');

module.exports = function(app){

  router.post('/',          permission.canCreate, linkCtrl.create );
  router.put('/:linkId',    permission.canUpdate, linkCtrl.update );
  router.delete('/:linkId', permission.canDelete, linkCtrl.delete );

  // Add the person endpoint to the router.
  app.use('/link', router);

};
