'use strict';

var express = require('express');
var router = express.Router();
// var permissions = require('../permissions/extract.permissions');

var organization = require('../../extractors/almanak/organizations');
var person = require('../../extractors/almanak/persons');


module.exports = function(app) {

  router.get('/almanak/organizations',
    organization.extractMunicipalities
  );
  router.get('/almanak/persons',
    person.extractPersons
  );
  router.get('/almanak/persons',
    person.extractPerson
  );

  app.use('/extract', router);
};
