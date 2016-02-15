/* globals sails, EventService */

'use strict';


module.exports = {

	find: function(req, res) {

		var Events = sails.models.event;

		sails.log('params',req.params);
		sails.log('query',req.query);

		// Fetch Events
    EventService.find(req.query, function(result) {
			// Create ical if needed
			if (req.query.ical === 'true') {
				Events.toiCal(result, function(err, ical) {

	        sails.log.info(err, ical);
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
	},

	ics: function(req, res) {
    var Events = sails.models.event;

		sails.log(req.params);

		Events.findOne(req.params.id, function(err, event) {
			if (err) { return res.serverError(err); }
			console.log('event', event);
			var a = [];
			a.push(event);
      Events.toiCal(a, function(err, ical) {
        sails.log.info(err, ical);
        return res.send(ical.toString());
      });
    });
  }
};
