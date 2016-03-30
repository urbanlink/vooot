/* globals sails, OrganizationService */

'use strict';

var request = require('request');
var moment = require('moment');

module.exports = {

	find: function(req, res) {

		var Organizations = sails.models.organization;

		sails.log('params',req.params);
		sails.log('query',req.query);

		// Fetch Events
    OrganizationService.find(req.query, function(result) {
			res.json(result);
    });
  },

	findOne: function(req, res) {
		OrganizationService.findOne(req.params.id, function(result) {
      res.json(result);
		});
	}

	// create
		// create organization.
		// create associations.


	// update


	// delete


};
