'use strict';

var models    = require('../models/index');
var icalendar = require('icalendar');
var moment    = require('moment');
var cheerio   = require('cheerio');
var request   = require('request');
var async     = require('async');
var logger = require('winston');

// custom notubiz parser
var notubiz = require('./../modules/notubiz');

// error handler
function handleError(res, err) {
  console.log(err);
  return res.status(500).json({status:'error', msg:err});
}

//
function toEvent(event) {
  var vevent = new icalendar.VEvent(event.id);
    if (event.name) { vevent.setSummary(event.name); }
    if (event.description) { vevent.setDescription(event.description); }
    if (event.start_date && event.end_date) { vevent.setDate(event.start_date, event.end_date); }
    if (event.location) { vevent.addProperty('LOCATION', event.location); }
  return vevent;
}

// Generate iCalendar file
function toiCal(events, callback) {

  var calendar = new icalendar.iCalendar();
  calendar.properties.PRODID = [];
  calendar.addProperty('PRODID', '-//voOot//Calendar//EN');
  calendar.addProperty('SEQUENCE', '0');
  calendar.addProperty('METHOD', 'REQUEST');

  // Add events to calendar
  for (var i=0; i<events.length; i++) {
    var event = events[i];
    if (event.start_date && event.end_date) {
      var vevent = toEvent(event);
      calendar.addComponent(vevent);
    }
  }

  return callback(null, calendar);
}

// Event index
exports.index = function(req,res) {

  console.log(req.query);
  var limit = parseInt(req.query.limit) || 10;
  if (limit > 50) { limit = 150; }
  var offset = parseInt(req.query.offset) || 0;
  var sort = req.query.sort || 'start_date';
  var order = req.query.order || 'ASC';
  var filter = {};
  if (req.query.organization_id) { filter.organization_id = req.query.organization_id; }
  // parse start and end date
  if (req.query.start_date) {
    var start =  moment(req.query.start_date, 'DD-MM-YYYY').format();
    filter.start_date = { $gt: start};
  }
  if (req.query.end_date) {
    var end =  moment(req.query.end_date, 'DD-MM-YYYY').format();
    filter.end_date = { $lt: end};
  }

  models.Event.findAndCountAll({
    where: filter,
    limit: limit,
    offset: offset,
    order: sort + ' ' + order,
    include: [
      { model: models.Organization, as:'organization', attributes: ['id', 'name', 'summary', 'classification'] },
      { model: models.Identifier, as: 'identifiers', attributes: ['scheme', 'identifier'] },
      { model: models.Agenda, as: 'agenda', attributes: ['id'] },
    ]
  }).then(function(result) {
    if (req.query.ical) {
      toiCal(result, function(err,result){
        res.set('Content-Type', 'text/calendar');
        return res.send(result.toString());
      });
    } else {
      return res.json(result);
    }
  }).catch(function(err) {
    return handleError(res,err);
  });

};

exports.show = function(req,res) {
  logger.debug('Show event ' + req.params.id);
  models.Event.findOne({
    where: { id: req.params.id },
    include: [
      { model: models.Organization, as: 'organization' },
      { model: models.Identifier, as: 'identifiers', attributes: ['scheme', 'identifier'] },
      { model: models.Agenda, as: 'agenda', attributes: ['id'], include: [
        { model: models.AgendaItem, as: 'items', include: [
          { model: models.File, as: 'files' }
        ]}
      ]}
    ]
  }).then(function(event){
    return res.json(event);
  });
};

exports.create = function(req,res){
  models.Event.create(req.body).then(function(event) {
    return res.json(event);
  }).catch(function(err) {
    handleError(res,err);
  });
};

exports.update = function(req,res){
  models.Event.update(req.body, {
    where: { id: req.params.id }
  }).then(function(result){
    return res.json(result);
  }).catch(function(err){
    handleError(res,err);
  });
};

exports.destroy = function(req,res){
  models.Event.destroy({
    where: { id: req.params.id }
  }).then(function(result){
    return res.json(result);
  }).catch(function(err){
    handleError(res,err);
  });
};


// Sync a calendar, without agenda
exports.syncEvents = function(req,res) {

  var organization_id = req.query.organization_id;
  var start_date = moment(req.query.start_date, 'DD-MM-YYYY');

  if (!organization_id || !start_date) {
    return res.json({status: 'error', msg: 'missing parameter organization_id or start_date. '});
  }

  // get orgnization information
  models.Organization.findOne({
    where: { id: organization_id },
    include: [
      { model: models.Identifier, as: 'identifiers', attributes: ['scheme', 'identifier'] },
      { model: models.Event, as: 'events', limit:10 }
    ]
  }).then(function(organization) {
    if (!organization) { return res.json('Organization not found. '); }
    // Check if last sync date is less than current timestamp
    var difference = moment().diff(moment(organization.dataValues.last_sync_date), 'seconds');
    if (difference < 60) {
      return res.json({
        status: 'Too many requests, please wait ' + (60 - difference) + ' seconds. ',
        difference: difference
      });
    }

    var ori_source, identifier = organization.identifiers[0].dataValues;

    if (identifier.scheme === 'notubiz') {
      ori_source = 'http://' + identifier.identifier + '.raadsinformatie.nl';
    }

    var month = start_date.month();
    var year = start_date.year();
    var meetings = [];
    ori_source = ori_source + '/api/calendar/?month=' + (month +1) + '&year=' + year;

    request.get(ori_source, function(err,response,body) {
      if (err) { return handleError(res,err); }
      try {
        body = JSON.parse(body);
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
        // update or create each meeting synchronous.
        upsertEvents(meetings, function(result) {
          return res.json(result);
          organization.updateAttributes({last_sync_date: new Date() }).then(function(result){

          }).catch(function(error){
            return handleError(res,err);
          });
          return res.json({status: 'ok', statusMessage: 'Updated ' + meetings.length + ' meetings. '});
        })
      } catch(e) {
        console.log(e);
        // Async call is done, alert via callback
        //callback2();
      }
    });
  }).catch(function(error) {
    return res.json(error);
  });
};


// Synchronize a single event upstream.
exports.syncEvent = function(req,res) {
  var eventId = req.params.id;
  // Fetch the event based on event-id
  models.Event.findOne({
    where: { id: req.params.id },
    include: [
      { model: models.Organization, as: 'organization', include: [
        { model: models.Identifier, as: 'identifiers', attributes: ['scheme', 'identifier'] },
      ] },
      { model: models.Identifier, as: 'identifiers', attributes: ['scheme', 'identifier'] },
      { model: models.Agenda, as: 'agenda', attributes: ['id'], include: [
        { model: models.AgendaItem, as: 'items' }
      ] },
    ]
  }).then(function(result) {
    var event = result;
    if (!event) { return res.json(event); }

    // Check if last sync date is less than current timestamp
    var lastSync = moment(event.dataValues.last_sync_date);
    var difference = moment().diff(lastSync, 'seconds');
    if (difference < 60) {
      return res.json({
        status: 'Too many requests, please wait ' + (60 - difference) + ' seconds. ',
        difference: difference
      });
    }

    var scheme = event.dataValues.organization.dataValues.identifiers[0].scheme;
    if (scheme!=='notubiz') {
      return res.json({status:'error', msg: 'Only notubiz is available, not ' + scheme });
    }

    logger.log('Parsing ' + scheme + ' event.');
    notubiz.parseEvent({
      organization_identifier: event.dataValues.organization.dataValues.identifiers[0].identifier,
      event_identifier: event.dataValues.identifiers[0].identifier
    }, function(err,result) {
      if (err) { return res.json(err); }

      var items = result || {};
      logger.debug('Received ' + items.length + ' agenda items for ' + scheme);

      // Save each agenda-item to the database
      logger.debug('Upserting all agenda items. ');
      async.eachSeries(items, function interatee(item, next) {
        // Add a reference to the right agenda to the agenda-item.
        item.agenda_id = event.dataValues.agenda.dataValues.id;
        item.identifier_scheme = scheme;

        // Upsert the agenda-item based on the identifier.
        logger.debug('Upserting agenda-item.');
        upsertAgendaitemByIdentifier(item, function(error, result) {
          if (error) { return handleError(res,error); }

          var agendaItemId = result.id;

          // Process the documents for this agenda-item
          logger.debug('Upserting all documents for this agenda-item. ');
          async.eachSeries(item.documents, function iteratee(doc, nextDoc) {
            doc.agendaitem_id = agendaItemId;
            doc.identifier_scheme = scheme;
            upsertDocumentByIdentifier(doc, function(error, result) {
              if (error) { return handleError(res,error); }
              logger.debug('Document saved: ' + result.id);
              nextDoc();
            });
          }, function(err){
            // all docs processed.
            logger.debug('All docs for this agenda-item are processed. ');
            next();
          });
        });
      }, function(err) {
        // All items for the event are updated, update the event sync date
        logger.debug('All agende-items are saved. Updating event sync date. ');
        event.updateAttributes({ last_sync_date: new Date() }).then(function(result) {
          logger.debug('Done synchronizing');
          return res.json({
            status: 'Event synchronized',
            result: result,
            error: err
          });
        }).catch(function(error) {
          return handleError(res,error);
        });
      });
    });
  });
};



// update or create an agenda-item and identifier
function upsertAgendaitemByIdentifier(item, cb) {
  models.Identifier
    .find({ where: { identifier: item.identifier } })
    .then(function(result){
      if (result) {
        var agenda_item_id = result.agenda_item_id;
        models.AgendaItem.update(item, { where: { id: agenda_item_id } }).then(function(result) {
          cb(null, { id: agenda_item_id });
        }).catch(function(error) {
          logger.error('Event update error ', error);
          cb(error);
        });
      } else {
        // Create a new agenda item.
        models.AgendaItem.create(item).then(function(result) {
          // Add the identifier to the agenda item.
          var identifier = {
            scheme: item.identifier_scheme,
            identifier: item.identifier,
            agenda_item_id: result.id
          };
          models.Identifier.create(identifier).then(function(result) {
            cb(null, { id: identifier.agenda_item_id});
          });
        }).catch(function(error){
          logger.error('Error creating agenda item, ', error);
          cb(error);
        });
      }
    }).catch(function(error){
      logger.error('Error finding identifier:', error);
      cb(error);
    });
}

function upsertDocumentByIdentifier(doc, cb) {
  // get the document based on the provided identifier
  var documentIdentifier = doc.identifier;
  var agendaItemId = doc.agendaitem_id;

  // Try to find the identifier.
  models.Identifier.find({ where: { identifier: documentIdentifier } }).then(function(result) {
    if (result) {
      var fileId= result.file_id;
      models.File.update(doc, { where: { id: fileId } }).then(function(result) {
        cb(null, {id: fileId});
      }).catch(function(error){
        logger.error('File update error ', error);
        cb(error);
      });
    } else {
      // create the new file record
      models.File.create(doc).then(function(file) {
        var identifier = {
          scheme: doc.identifier_scheme,
          identifier: doc.identifier,
          file_id: file.id
        };
        // Create the identifier for this record
        models.Identifier.create(identifier).then(function(identifier) {

          // Add the file to the agenda-item
          models.AgendaItem.findById(agendaItemId).then(function(agendaItem){
            console.log(agendaItem);
            agendaItem.addFile(file).then(function(result) {
              cb(null, { id: file.id });
            }).catch(function(error) {
              console.log('ee',error);
            });
          }).catch(function(error) {
            console.log('eee',error);
          });
        });
      }).catch(function(error) {
        logger.error('Error creating file item, ', error);
        cb(error);
      });
    }
  }).catch(function(error){
    logger.error('Error finding identifier: ', error);
    cb(error);
  });
}

// Create an event or update an existing event, based on an identifier.
function upsertEvents(events, cb) {
  logger.debug('Updating or inserting ' + events.length + ' events.');
  async.eachSeries(events, function interatee(event, next){
    // if identifier, update related event.
    if (event.identifier) {
      models.Identifier.find({where: {
        identifier: event.identifier,
        scheme: event.identifier_scheme
      }}).then(function(result){
        if (result) {
          logger.debug('Identifier found: ' + result.id + '. Updating event.');
          models.Event.update(event, {where: {id: result.event_id}}).then(function(result) {
            logger.debug('Event updated.');
            next();
          }).catch(function(error) {
            logger.error('Event update error', error);
          });
        } else {
          logger.debug('Identifier not found. Creating new event. ');
          models.Event.create(event).then(function(result){
            logger.debug('Event created: ' + result.id);
            models.Identifier.create({
              scheme: event.identifier_scheme,
              identifier: event.identifier,
              event_id: result.id
            }).then(function(result){
              logger.debug('Identifier created: ' + result.id);
              next();
            });
          }).catch(function(error){
            logger.error('Error creating event, ', error);
          });
        }
      }).catch(function(error){
        logger.error('Error creating identifier:', error);
      });
    } else {
      models.Event.create(event).then(function(result){
        logger.debug('Event created: ' + result.id);
        next();
      }).catch(function(error){
        logger.debug('Error creating event:', error);
      });
    }
  }, function(err) {
    if (err) { logger.error(err); }
    logger.debug('Iterating done. ');
    cb();
  });
}
