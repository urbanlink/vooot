/* globals sails, EventService */

'use strict';

var request = require('request');
var moment = require('moment');

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


	sync: function(req, res) {
		request('http://denhaag.raadsinformatie.nl/api/calendar/callback_function?year=2016&month=3&callback=callback_function', function(error, response, body) {
		  if (!error && response.statusCode === 200) {

				body = body.slice(18, body.length);
				body = body.slice(0, body.length -1);
				body = JSON.parse(body);

				// parse events and save
				//2016-02-15T19:41:27.783Z
				var dates = [];
				for (var i=0; i<body.meetings.length;i++){
					var start = moment(body.meetings[ i].date + '-' + body.meetings[ i].time, 'DD-MM-gggg-HH-mm');
					var startDate = moment.utc(start).format();
					var endDate = moment(start).add(2, 'h').format();


					var m = {
						title: body.meetings[ i].short_description,
						description: body.meetings[ i].description,
						startDate: startDate,
						endDate: endDate,
						location: body.meetings[ i].location
					};

					EventService.create(m, function(result){
						console.log(result);
					});
				}

				res.send(dates);
		  }
		});
	}
};
