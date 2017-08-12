'use strict';

var express = require('express');
var router = express.Router();

var acl = require('../permissions');
var validator = require('../validators');
var controller = require('../controllers');


module.exports = function(app){

  /**
   *
   *  GET requests for events.
   *
   **/
  router.get( '/',
    acl.event.canView,
    controller.event.index
  );
  router.get('/query',
    acl.event.canView,
    controller.event.query
  );

  router.get('/calendar',
    // acl.event.canView,
    controller.calendar.get
  );

  router.get('/:eventId',
    validator.areParamsInt,
    acl.event.canView,
    controller.event.show
  );


  /**
   *
   *  POST requests for events.
   *
   **/
  router.post('/',
    acl.event.canCreate,
    validator.event.validDates,
    controller.event.create
  );


  /**
   *
   *  PUT requests for events.
   *
   **/
  router.put('/:eventId',
    validator.areParamsInt,
    acl.event.canUpdate,
    controller.event.update
  );


  /**
   *
   *  DELETE requests for events.
   *
   **/
  router.delete('/:eventId',
    validator.areParamsInt,
    acl.event.canDelete,
    controller.event.delete
  );


  // Add the event endpoint to the router.
  app.use('/event', router);
};
