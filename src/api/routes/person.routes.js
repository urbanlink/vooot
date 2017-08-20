'use strict';

var express = require('express');
var router = express.Router();

var acl = require('../permissions');
var validator = require('../validators');
var controller = require('../controllers');


module.exports = function(app){

  /**
   *
   *  GET requests for persons.
   *
   **/
  router.get( '/', acl.person.canView, controller.person.index );
  router.get( '/query', acl.person.canView, controller.person.query );

  router.get( '/contact-types', controller.person_contact.types );

  router.get('/:personId', validator.areParamsInt, acl.person.canView, controller.person.show );


  /**
   *
   *  POST requests for persons.
   *
   **/
  router.post('/',
    acl.person.canCreate,
    controller.person.create
  );
  router.post('/:personId/othername',
    validator.areParamsInt,
    acl.person.canUpdate,
    controller.person_othername.create
  );
  router.post('/:personId/contact',
    validator.areParamsInt,
    acl.person.canUpdate,
    controller.person_contact.create
  );
  router.post('/:personId/job',
    validator.areParamsInt,
    acl.person.canUpdate,
    controller.person_job.create
  );


  /**
   *
   *  PUT requests for persons.
   *
   **/
  router.put('/:personId',
    validator.areParamsInt,
    acl.person.canUpdate,
    controller.person.update
  );
  router.put('/:personId/othername',
    validator.areParamsInt,
    acl.person.canUpdate,
    controller.person_othername.update
  );
  router.put('/:personId/contact',
    validator.areParamsInt,
    acl.person.canUpdate,
    controller.person_contact.update
  );
  router.put('/:personId/job',
    validator.areParamsInt,
    acl.person.canUpdate,
    controller.person_job.update
  );


  /**
   *
   *  DELETE requests for persons.
   *
   **/
  router.delete('/:personId',
    validator.areParamsInt,
    acl.person.canDelete,
    controller.person.delete
  );
  router.delete('/:personId/othername/:othernameId',
    validator.areParamsInt,
    acl.person.canUpdate,
    controller.person_othername.delete
  );
  router.delete('/:personId/contact/:contactId',
    validator.areParamsInt,
    acl.person.canUpdate,
    controller.person_contact.delete
  );
  router.delete('/:personId/job/:jobId',
    validator.areParamsInt,
    acl.person.canUpdate,
    controller.person_job.delete
  );


  // Add the person endpoint to the router.
  app.use('/person', router);
};
