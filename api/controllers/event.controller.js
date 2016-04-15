'use strict';

var models = require('../models/index');
var icalendar = require('icalendar');
var moment = require('moment');
var cheerio = require('cheerio');
var request = require('request');
var async = require('async');


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

  var limit = req.query.limit || 10;
  if (limit > 50) { limit = 150; }
  var offset = req.query.offset || 0;
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

  models.Event.findAll({
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
  models.Event.findOne({
    where: { id: req.params.id },
    include: [
      { model: models.Organization, as: 'organization' },
      { model: models.Identifier, as: 'identifiers', attributes: ['scheme', 'identifier'] },
      { model: models.Agenda, as: 'agenda', attributes: ['id'], include: [
        { model: models.AgendaItem, as: 'items' }
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


// Synchronize a single event upstream.
exports.syncEvent = function(req,res) {
  var eventId = req.params.id;

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
    if (!result) { return res.json(result); }

    var event = result;
    // Notubiz default for now;
    var source = {
      scheme: result.dataValues.organization.dataValues.identifiers[0].scheme,
      identifier: result.dataValues.organization.dataValues.identifiers[0].identifier,
      event: result.dataValues.identifiers[0].identifier,
      url: 'http://' + result.dataValues.organization.dataValues.identifiers[0].identifier + '.raadsinformatie.nl/vergadering/' + result.dataValues.identifiers[0].identifier
    };

    // parse external notubiz page and handle result.
    parseNotubizEvent(source, function(err, result) {
      var items = result;
      console.log('Received ' + items.length + ' agenda items');
      //return res.json(result);
      // Save items to database
      async.eachSeries(items, function interatee(item, next) {
        item.agenda_id = event.dataValues.agenda.dataValues.id;
        var filter = {where: { identifier: item.identifier, scheme: source.scheme }};
        console.log('filter', filter);
        // Create or update agenda item, find by identifier
        models.Identifier
          .find(filter)
          .then(function(result){
            if (result) {
              console.log('Identifier found: ' + result.id + '. Updating agenda item.');
              models.AgendaItem.update(item, {where: {id: result.agenda_item_id}}).then(function(result) {
                console.log('item updated.');
                next();
              }).catch(function(error) {
                console.log('event update error', error);
              });
            } else {
              console.log('Identifier not found. Creating new agenda item. ');
              models.AgendaItem.create(item).then(function(result) {
                console.log('Agenda item created: ' + result.id);
                console.log(item);
                models.Identifier.create({
                  scheme: source.scheme,
                  identifier: item.identifier,
                  agenda_item_id: result.id
                }).then(function(result){
                  console.log('Identifier created: ' + result.id);
                  next();
                });
              }).catch(function(error){
                console.log('Error creating agenda item, ', error);
              });
            }
          }).catch(function(error){
            console.log('error creating identifier:', error);
          });

      }, function(err){

        return res.json({
          s: source,
          e: event,
          r: result,
          error: err
        });
      });
    });
  });
};

function parseNotubizEvent(source, cb) {

  request.get(source.url, function(err, response, body) {
    if (err) { return cb(err, null); }

    // Throw away extra white space and non-alphanumeric characters.
    body = body
      .replace(/^\s+|\s+$/g, '')     // remove whitespace at beginning and end of a line
      .replace(/\r?\n|\r|\t/g, '')   // remove tabs and newlines at beginning and end of a line
      //.replace(/[^a-zA-Z ]/g, "")
      //.toLowerCase()
    ;

    // parse body
    var $ = cheerio.load(body);

    var item = {
      type: null, // point, heading
      prefix: null, // null, count, tkn
      title: null, //
      identifier: null, // notubiz identifier ai_9999
      documents: null
    };

    var items = [];

    // Get each agenda_item
    $('#agenda ul.agenda_items li.agenda_item').each(function(i,elem) {
      var item = {
        type: null
      };

      // Get the type of agenda_item
      if ($(this).hasClass('heading') === true) {
        item.type = 'heading';
      }

      // Get the prefixes of each agenda item
      $(this).find('h4 span.item_title .item_prefix').each(function(i,elem) {
        item.prefix = $(this).text();
        // remove the prefixes so they don't show up in the title
        $(this).empty();
      });

      // Get the title of each agenda item
      $(this).find('h4 span.item_title').each(function(i,elem) {
        item.title = $(this).text();
      });

      // Get the id of each agenda item
      item.identifier = $(this).attr('id');

      // Get documents for each agenda item
      var documents = [];
      var documentslist = $(this).find('.agenda_item_content ul.documents li').each(function(i,elem) {
        var doc = {
          type: $(this).find('.document_type').text(),
          title: $(this).find('.document_title').text(),
          link: $(this).find('a').attr('href'),
        };
        var l = $(this).find('a').attr('href').split('/');
        doc.identifier = l[ l.length -2];

        documents.push(doc);
      });
      item.documents = documents;

      items.push(item);
    });

    return cb(null, items);
  });
}
