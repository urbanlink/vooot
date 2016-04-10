'use strict';

var models = require('../models/index');
var icalendar = require('icalendar');
var moment = require('moment');

// error handler
function handleError(res, err) {
  console.log('Error: ', err);
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
  console.log(filter);

  models.Event.findAll({
    where: filter,
    limit: limit,
    offset: offset,
    order: sort + ' ' + order,
    include: [
      { model: models.Organization, as:'organization', attributes: ['id', 'name', 'summary', 'classification'] },
      { model: models.Identifier, as: 'identifiers', attributes: ['scheme', 'identifier'] }
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
  }).catch(function(err){
    console.log('error', err);
    return res.json({err:err});
  });

};

exports.show = function(req,res) {
  models.Event.findOne({
    where: { id: req.params.id },
    include: [
      { model: models.Organization, as: 'organization' },
      { model: models.Identifier, as: 'identifiers', attributes: ['scheme', 'identifier'] }
    ]
  }).then(function(event){
    return res.json(event);
  });
};

exports.create = function(req,res){
  models.Event.create(req.body).then(function(result) {
    return res.json(result);
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

exports.sync = function(req,res) {
  require('./../../bin/cron/events').syncEvents();
  return res.json({result: 'synced'});
};


exports.showAgenda = function(req,res) {
  // get organization for event
  models.Event.findOne({
    where: { id: req.params.id },
    include: [
      { model: models.Organization, as: 'organization' },
      { model: models.Identifier, as: 'identifiers', attributes: ['scheme', 'identifier'] }
    ]
  }).then(function(event){
    if (!event) { return res.json(event); }
    
    // Get ori_identifier for this event.
    var id = event.dataValues.identifiers[0].identifier || null;
    if (!id) { return res.json(null); }

    var request = require('request');
    var cheerio = require('cheerio');
    var baseUrl = event.organization.ori_source;
    var url = baseUrl + '/vergadering/' + id;

    request.get(url, function(err,response,body) {
      if (err) {
        return res.json({error: err });
      }

      // Throw away extra white space and non-alphanumeric characters.
      body = body
        .replace(/^\s+|\s+$/g, '')     // remove whitespace at beginning and end of a line
        .replace(/\r?\n|\r|\t/g, '')   // remove tabs and newlines at beginning and end of a line
        //.replace(/[^a-zA-Z ]/g, "")
        //.toLowerCase();
      ;

      var $ = cheerio.load(body);

      var agenda_types = []; // point, heading
      var agenda_prefixes = []; // null, count, tkn
      var agenda_titles = []; //
      var agenda_identifiers = []; // notubiz identifier ai_9999
      var agenda_documents = [];

      // Get the type of agenda_item
      $('#agenda ul.agenda_items li.agenda_item').each(function(i,elem) {
        if ($(this).hasClass('heading') === true) {
          agenda_types[ i] = 'heading';
        } else {
          agenda_types[ i] = null;
        }
      });

      // Get the prefixes of each agenda item
      $('#agenda ul.agenda_items li.agenda_item h4 span.item_title .item_prefix').each(function(i,elem) {
        agenda_prefixes[i] = $(this).text();
        // remove the prefixes so they don't show up in the title
        $(this).empty();
      });

      // Get the title of each agenda item
      $('#agenda ul.agenda_items li.agenda_item h4 span.item_title').each(function(i,elem) {
        agenda_titles[i] = $(this).text();
      });

      // Get the title of each agenda item
      $('#agenda ul.agenda_items li.agenda_item').each(function(i,elem) {
        agenda_identifiers[ i] = $(this).attr('id');
      });

      // Get documents for each agenda item
      $('#agenda ul.agenda_items li.agenda_item').each(function(i,elem) {

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
        agenda_documents[i] = documents;
      });

      var items = [];
      for (var i=0; i<agenda_titles.length; i++){
        var item={
          type: agenda_types[ i],
          prefix: agenda_prefixes[ i],
          title: agenda_titles[ i],
          identifier: agenda_identifiers[ i],
          documents: agenda_documents[ i]
        };

        items.push(item);
      }
      res.send(items);
    });
  });
};
