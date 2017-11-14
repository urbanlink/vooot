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
  router.get( '/', acl.canView, controller.person.index );
  router.get( '/query', acl.canView, controller.person.query );

  router.get( '/contact-types', controller.person_contact.types );

  router.get('/:personId', validator.areParamsInt, acl.canView, controller.person.show );


  /**
   *
   *  POST requests for persons.
   *
   **/
  router.post('/',
    acl.canCreate,
    controller.person.create
  );
  router.post('/:personId/othername',
    validator.areParamsInt,
    acl.canUpdate,
    controller.person_othername.create
  );
  router.post('/:personId/contact',
    validator.areParamsInt,
    acl.canUpdate,
    controller.person_contact.create
  );
  router.post('/:personId/job',
    validator.areParamsInt,
    acl.canUpdate,
    controller.person_job.create
  );
  router.post('/:personId/follow',
    validator.areParamsInt,
    acl.canUpdate,
    controller.person.follow
  );


  /**
   *
   *  PUT requests for persons.
   *
   **/
  router.put('/:personId',
    validator.areParamsInt,
    acl.canUpdate,
    controller.person.update
  );
  router.put('/:personId/othername',
    validator.areParamsInt,
    acl.canUpdate,
    controller.person_othername.update
  );
  router.put('/:personId/contact',
    validator.areParamsInt,
    acl.canUpdate,
    controller.person_contact.update
  );
  router.put('/:personId/job',
    validator.areParamsInt,
    acl.canUpdate,
    controller.person_job.update
  );


  /**
   *
   *  DELETE requests for persons.
   *
   **/
  router.delete('/:personId',
    validator.areParamsInt,
    acl.canDelete,
    controller.person.delete
  );
  router.delete('/:personId/follow',
    validator.areParamsInt,
    acl.canUpdate,
    controller.person.unfollow
  );
  router.delete('/:personId/othername/:othernameId',
    validator.areParamsInt,
    acl.canUpdate,
    controller.person_othername.delete
  );
  router.delete('/:personId/contact/:contactId',
    validator.areParamsInt,
    acl.canUpdate,
    controller.person_contact.delete
  );
  router.delete('/:personId/job/:jobId',
    validator.areParamsInt,
    acl.canUpdate,
    controller.person_job.delete
  );


  // Add the person endpoint to the router.
  app.use('/person', router);
};
