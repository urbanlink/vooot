/* global sails, OrganizationService, EventService */

'use strict';

var moment = require('moment');
var request = require('request');
var async = require('async');

var running = false;

// Sync all future events of all organizations
module.exports = {

  syncEvents: function() {
    if (running) { return; }
    running=true;
    sails.log('Syncing all future events for organizations. ');
    // Get organizations and source url for events.
    sails.log('Fetching all organizations and source url for events.');
    OrganizationService.find(null, function(organizations){
      sails.log('Found ' + organizations.length + ' organization(s)');
      if (organizations && organizations.length>0) {
        for (var i=0; i<organizations.length; i++) {
          var organization = organizations[ i];
          // Get list of events for next 12 months of this organization.
          sails.log('Fetching future 12 month events for organization: ' + organization.name);

          var queries = createMonthCalls();
          for(var k=0; k<queries.length; k++){
            queries[ k] = organization.meta.sources.events + queries[ k];
          }

          async.map(queries, fetchEvents, function(err, events) {
            var meetings = [];

            if (events && events.length>0){
              for (var l=0; l<events.length; l++) {
                if (events[ l] && events[ l].meetings) {
                  for (var m=0; m<events[ l].meetings.length; m++) {
                    var event = events[ l].meetings[ m];
                    event.organization_id = organization.id;
                    event.identifier_scheme = 'notubiz';
                    event.identifier = event.id;
                    //process notubiz data
                    event.name = event.description;
                    event.start_date = moment(event.date + ' ' + event.time, 'DD-MM-YYYY HH:mm').format();
                    event.end_date = moment(event.start_date).add(2, 'h').format();
                    // add the single meeting to the new meeting list.
                    meetings.push(event);
                  }
                }
              }
              // Update or create each event in the voOot database.
              sails.log('Updating or creating events.');
              updateEvents(meetings, function(result) {
              //
              //
              });
            }

          });
        }
      } else {
        sails.log('No organizations found. ');
      }
    });
  }
};

function updateEvents(events, cb) {
  sails.log('updating events');
  async.eachSeries(events, function interatee(event, next){
    delete event.id;
    //sails.log('updating event ', event);

    EventService.updateOrCreate(event, function(result){
      //sails.log('Update or create result', result);
      next();
    });

  }, function(err){

    sails.log('Iterating done');
  });
}


// Fetch events from a given url and return the json object.
function fetchEvents(source, cb) {
  request.get(source, function(err,response,body) {
    if (err) {
      cb(err);
    } else {
      try {
        body = JSON.parse(body);
        cb(null,body);
      } catch(e) {
        cb(e);
      }
    }
  });
}

// Helper function to create an array of the next 12 months (year=2015&month=6)
function createMonthCalls() {
  var queries = [];
  var currentYear = moment().year();
  var currentMonth = moment().month();
  for (var i=0; i<12; i++){
    currentMonth++;
    if (currentMonth>12) {
      currentMonth=1;
      currentYear++;
    }
    queries.push('year=' + currentYear + '&month=' + currentMonth);
  }
  return queries;
}
