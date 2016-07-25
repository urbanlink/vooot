'use strict';

var express = require('express');
var router = express.Router();
var controller = require('../controllers/message.controller');
var permission = require('../permissions/message.permissions');

module.exports = function(app){

  router.get('/',
    permission.canView,
    controller.index
  );

  router.get('/:id',
    permission.canView,
    controller.show
  );

  router.post('/',
    permission.canCreate,
    controller.create
  );

  router.put('/:id',
    permission.canUpdate,
    controller.update
  );
  router.delete('/:id',
    permission.canDelete,
    controller.destroy
  );

  app.use('/message', router);
};
