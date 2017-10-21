'use strict';

var moment = require('moment');
var request = require('request');
var async = require('async');
var models = require('../../api/models');

var running = false;


// Helper function to create an array of the next 12 months (year=2015&month=6)
function createMonthCalls(params) {
  var queries = [];
  var currentYear = moment().year();
  var currentMonth = moment().month();
  for (var i=0; i<2; i++){
    currentMonth++;
    if (currentMonth>12) {
      currentMonth=1;
      currentYear++;
    }
    queries.push(params.ori_source + 'year=' + currentYear + '&month=' + currentMonth);
  }
  return queries;
}

function updateEvents(events, cb) {
  logger.info('Updating or inserting ' + events.length + ' events.');
  async.eachSeries(events, function interatee(event, next){
    // if identifier, update related event.
    if (event.identifier) {
      models.identifier.find({where: {
        identifier: event.identifier,
        scheme: event.identifier_scheme
      }}).then(function(result){
        if (result) {
          logger.info('Identifier found: ' + result.id + '. Updating event.');
          models.event.update(event, {where: {id: result.event_id}}).then(function(result) {
            logger.info('event updated', result);
            next()
          }).catch(function(error) {
            logger.info('event update error', error);
          });
        } else {
          logger.info('Identifier not found. Creating new event. ');
          models.event.create(event).then(function(result){
            logger.info('event created: ' + result.id);
            models.identifier.create({
              scheme: event.identifier_scheme,
              identifier: event.identifier,
              event_id: result.id
            }).then(function(result){
              logger.info('identifier created: ' + result.id);
              next();
            });
          }).catch(function(error){
            logger.info('Error creating event, ', error);
          });
        }
      }).catch(function(error){
        logger.info('error creating identifier:', error);
      });
    } else {
      models.event.create(event).then(function(result){
        logger.info('event created: ' + result.id);
        next();
      }).catch(function(error){
        logger.info('error creating event:', error);
      });
    }
  }, function(err) {
    if (err) { logger.info(err); }
    logger.info('Iterating done. ');
    cb();
  });
}

// 1. fetch organizations
// 2. async: fetch organizations events
// 3. async: save events per organization


// Sync all future events of all organizations
module.exports = {

  syncEvents: function() {
    if (running) { return; }
    running=!running;
    var meetings = [];

    logger.info('Cron: Syncing all future events for organizations. ');
    // Get organizations and source url for events.
    logger.info('Fetching all organizations and source url for events.');

    models.organization.findAll({
      include: [
        { model: models.identifier, as: 'identifiers' }
      ]
    }).then(function(organizations) {
      logger.info('Found ' + organizations.length + ' organization(s)');
      if (!organizations || organizations.length<1) { return; }

      async.each(organizations, function(organization,callback) {
        // get events for the Organization
        logger.info('Fetching future 12 month events for organization: ' + organization.name);
        var identifier;
        if (organization.identifiers[0]) {
          identifier = organization.identifiers[0].dataValues;
          logger.info(identifier);

          var ori_source =  'http://' + identifier.identifier + '.raadsinformatie.nl';
          var queries = createMonthCalls({ori_source: ori_source + '/api/calendar?'});

          async.each(queries, function(query, callback2){
            logger.info(query);
            // put in timer to prevent conn refused
            setTimeout(function() {
              request.get(query, function(err,response,body) {
                if (err) {
                  logger.info(err);
                  // Async call is done, alert via callback
                  callback2();
                } else {
                  try {
                    body = JSON.parse(body);
                    //logger.info(body);
                    if (body.meetings && body.meetings.length>0) {
                      for (var k=0; k<body.meetings.length; k++) {
                        var meeting = body.meetings[ k];
                        meeting.organization_id = organization.id;
                        meeting.identifier_scheme = 'notubiz';
                        meeting.identifier = meeting.id;
                        delete meeting.id;
                        meeting.name = meeting.description;
                        meeting.start_date = moment(meeting.date + ' ' + meeting.time, 'DD-MM-YYYY HH:mm').format();
                        meeting.end_date = moment(meeting.start_date).add(2, 'h').format();
                        meeting.last_sync_date = new Date();
                        // add the single meeting to the new meeting list.
                        meetings.push(body.meetings[ k]);
                      }
                    }
                    // Async call is done, alert via callback
                    callback2();
                  } catch(e) {
                    logger.info(e);
                    // Async call is done, alert via callback
                    callback2();
                  }
                }
              });
            }, 1000);
          }, function(err) {
            if (err) { logger.info(err); }
            logger.info('Queries done. Processing events. ');
            callback();
          });
        }
      }, function(err){
        if (err) { logger.info('error'); }
        logger.info('done fetching meetings. ');
        logger.info('meetings: ' + meetings.length);
        updateEvents(meetings, function(error) {
          if(error){ logger.info(error); }
          logger.info('Done updating meetings');
          running=false;
        });
      });
    });
  }
};
