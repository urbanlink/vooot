'use strict';

var icalendar = require('icalendar');
//var moment = require('moment');

module.exports = {

  attributes: {
    // Popolo fields
    name: {
      type: 'string'
    },
    description: {
      type: 'text'
    },
    start_date: {
      type: 'datetime'
    },
    end_date: {
      type: 'datetime'
    },
    location: {
      type: 'string'
    },
    status: {
      type: 'string'
      // cancelled, confirmed, tentative
    },
    classification: {
      type: 'string'
    },
    organization_id: {
      model: 'organization'
    },
    attendees: {
      type: 'array'
    },
    parent_id: {
      type: 'string'
    },

    // Associations
    identifiers: {
      collection: 'identifier',
      via: 'event'
    },


    // voOot fields
    last_sync_date: {
      type: 'datetime'
    },

    // Attribute methods
    toEvent: function() {
      var self = this;
      var vevent = new icalendar.VEvent(self.id);
      var summary = self.name;
      vevent.setSummary(summary);
      vevent.setDescription(self.description);
      vevent.setDate(this.start_date, this.end_date);
      var location = this.location;
      vevent.addProperty('LOCATION', location);

      return vevent;
    }
  },

  // Generate iCalendar file
  toiCal: function(events, callback) {

    var calendar = new icalendar.iCalendar();
    calendar.properties.PRODID = [];
    calendar.addProperty('PRODID', '-//voOot//Calendar//EN');
    calendar.addProperty('SEQUENCE', '0');
    calendar.addProperty('METHOD', 'REQUEST');

    // Add events to calendar
    for (var i=0; i<events.length; i++) {
      var event = events[i];
      if (event.start_date && event.end_date) {
        var vevent = event.toEvent();
        calendar.addComponent(vevent);
      }
    }

    return callback(null, calendar);
  }
};
