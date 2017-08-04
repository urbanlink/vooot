'use strict';

var express = require('express');
var router = express.Router();
var controller = require('../controllers/person.controller');
var permission = require('../permissions/person.permissions');

module.exports = function(app){

  /**
   *
   *  GET requests for persons.
   *
   **/
  router.get( '/',     permission.canView, controller.index );
  router.get('/query', permission.canView, controller.query );
  router.get('/:id',   permission.canView, controller.show );


  /**
   *
   *  POST requests for persons.
   *
   **/
  router.post('/',               permission.canCreate, controller.create );
  router.post('/:id/identifier', permission.canUpdate, controller.addIdentifier );
  router.post('/:id/name',       permission.canUpdate, controller.addName );
  router.post('/:id/contact',    permission.canUpdate, controller.addContact );
  router.post('/:id/link',       permission.canUpdate, controller.addLink );
  router.post('/:id/job',        permission.canUpdate, controller.addJob);


  /**
   *
   *  PUT requests for persons.
   *
   **/
  router.put('/:id',            permission.canUpdate, controller.update );
  router.put('/:id/identifier', permission.canUpdate, controller.updateIdentifier );
  router.put('/:id/name',       permission.canUpdate, controller.updateName );
  router.put('/:id/contact',    permission.canUpdate, controller.updateContact );
  router.put('/:id/link',       permission.canUpdate, controller.updateLink );
  router.put('/:id/job',       permission.canUpdate, controller.updateJob );


  /**
   *
   *  DELETE requests for persons.
   *
   **/
  router.delete('/:personId',                          permission.canDelete, controller.delete );
  router.delete('/:personId/identifier/:identifierId', permission.canUpdate, controller.deleteIdentifier );
  router.delete('/:personId/name/:othernameId',       permission.canUpdate, controller.deleteName );
  router.delete('/:personId/contact/:contactId',    permission.canUpdate, controller.deleteContact );
  router.delete('/:personId/link/:linkId',       permission.canUpdate, controller.deleteLink );
  router.delete('/:personId/job/:jobId',       permission.canUpdate, controller.deleteJob );


  // Add the person endpoint to the router.
  app.use('/person', router);
};
