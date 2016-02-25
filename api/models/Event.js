'use strict';

var icalendar = require('icalendar');
//var moment = require('moment');

module.exports = {

  attributes: {
    // Attributes
    title: {
      type: 'string'
    },
    description: {
      type: 'text'
    },
    startDate: {
      type: 'datetime'
    },
    endDate: {
      type: 'datetime'
    },

    // Attribute methods
    toEvent: function() {
      var self = this;
      var vevent = new icalendar.VEvent(self.id);
      var summary = self.title;
      vevent.setSummary(summary);
      vevent.setDescription(self.description);
      vevent.setDate(this.startDate, this.endDate);
      var location = 'Den Haag';
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
      if (event.startDate && event.endDate) {
        var vevent = event.toEvent();
        calendar.addComponent(vevent);
      }
    }

    return callback(null, calendar);
  }
};
