'use strict';

var moment = require('moment');
var models = require('../models/index');
var settings = require('../../config/settings');
var logger = require('../../config/logger');
var utils = require('../utils');

// Show a single event
exports.get = function(req,res) {
  console.log('getCalendar - ' + req.headers['user-agent']);
  models.event.findAll().then(function(events){

    var iCal=[];
    iCal.push('BEGIN:VCALENDAR');
    iCal.push('ALSCALE:GREGORIAN');
    iCal.push('VERSION:2.0');
    iCal.push('X-WR-CALNAME:voOot calendar');
    iCal.push('METHOD:PUBLISH');
    iCal.push('PRODID:-//voOot//NONSGML iCal Demo Calendar//EN');
    iCal.push('TZID:Europe/Amsterdam');

    // add events
    for (var i=0; i<events.length; i++) {
      iCal.push(parseEvent(events[ i].dataValues));
    }
    // add footer
    iCal.push('END:VCALENDAR');
    // create string
    iCal = iCal.join('\r\n');

    res.set('Content-Type', 'text/calendar;charset=utf-8');
    res.set('Content-Disposition', 'attachment; filename="vooot.ics"');
    res.send(iCal);

  }).catch(function(err) {
    return res.status(500).json(err);
  });
};

// Parse a db-event to ICS-event
function parseEvent(source) {

  var event = [];
  event.push('BEGIN:VEVENT');
  event.push('SUMMARY:' + source.title + ' [voOot ' + source.id + ']');
  event.push('UID:' + source.id + '@vooot.nl');
  event.push('SEQUENCE:0');
  event.push('STATUS:CONFIRMED');
  event.push('TRANSP:TRANSPARENT');
  // event.push('RRULE:FREQ=YEARLY;INTERVAL=1;BYMONTH=2;BYMONTHDAY=12');

  event.push('DTSTART:' + moment.tz(source.startdate, 'YYYYMMDDTHHmmss', 'Europe/Amsterdam').utc().format('YYYYMMDDTHHmmss'));
  event.push('DTEND:' + moment.tz(source.enddate, 'YYYYMMDDTHHmmss', 'Europe/Amsterdam').utc().format('YYYYMMDDTHHmmss'));
  event.push('DTSTAMP:' + moment.tz(source.created_at, 'YYYYMMDDTHHmmss', 'Europe/Amsterdam').utc().format('YYYYMMDDTHHmmss'));
  // event.push('CATEGORIES:U.S. Presidents,Civil War People');
  event.push('LOCATION:The Hague, The Netherlands');
  event.push('GEO:52.070498;4.300700');
  event.push('DESCRIPTION:' + source.description);
  event.push('URL:https://api.vooot.nl/event/' + source.id);
  // Add attendees
  event.push('ATTENDEE;RSVP=TRUE;ROLE=REQ-PARTICIPANT:mailto:info@vooot.nl');

  event.push('END:VEVENT');

  // Send back the event as a string
  return(event.join('\r\n'));
}
