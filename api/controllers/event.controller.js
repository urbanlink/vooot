'use strict';

var models = require('../models/index');
var icalendar = require('icalendar');

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
  var limit = req.query.limit || 10;
  if (limit > 50) { limit = 50; }
  var offset = req.query.offset || 0;
  var order = req.query.order || 'created_at DESC';
  var filter = {};
  if (req.query.organization_id) { filter.organization_id = req.query.organization_id; }

  models.Event.findAll({
    where: filter,
    limit: limit,
    offset: offset,
    order: order,
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
      { model: models.Organization, as: 'organization' }
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
