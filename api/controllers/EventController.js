/* globals sails, EventService */

'use strict';

var request = require('request');
var moment = require('moment');

module.exports = {

	find: function(req, res) {

		var Events = sails.models.event;

		// Fetch Events
    EventService.find(req.query, function(result) {
			// Create ical if needed
			if (req.query.ical === 'true') {
				Events.toiCal(result, function(err, ical) {

	        sails.log.info(err, ical);
					res.set('Content-Type', 'text/calendar');
	        return res.send(ical.toString());
	      });
			} else {
				res.json(result);
			}
    });
  },

	findOne: function(req, res) {
		EventService.findOne(req.params.id, function(result) {
      res.json({ challenge: result });
		});
	}

};
