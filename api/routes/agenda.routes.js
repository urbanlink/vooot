'use strict';

var express = require('express');
var router = express.Router();
var agendaCtrl = require('../controllers/agenda.controller');
var agendaPermissions = require('../permissions/agenda.permissions');

module.exports = function(app){
  router.get('/',
    agendaPermissions.canView,
    agendaCtrl.index
  );

  // router.agenda('/:id/sync',
  //   agendaPermissions.canView,
  //   agendaCtrl.show
  // );

  router.get('/:id',
    agendaPermissions.canView,
    agendaCtrl.show
  );

  router.post('/',
    agendaPermissions.canCreate,
    agendaCtrl.create
  );
  router.put('/:id',
    agendaPermissions.canUpdate,
    agendaCtrl.update
  );
  router.delete('/:id',
    agendaPermissions.canDelete,
    agendaCtrl.destroy
  );

  app.use('/agenda', router);
};
