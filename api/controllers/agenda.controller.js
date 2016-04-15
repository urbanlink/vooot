'use strict';

var models = require('../models/index');
var request = require('request');
var cheerio = require('cheerio');

/**

get agenda by
  - agenda_id
    /:id
  - event_id
    /?event_id=:id

Sync an agenda

**/


exports.index = function(req,res) {

  // Query based on voOot-event-id:
  if (req.query.event_id) {
    models.Agenda.find({
      where: {
        event_id: req.query.event_id
      },
      include: [
        { model: models.AgendaItems, as: 'items' }
      ]
    }).then(function(result){
      return res.json(result);
    }).catch(function(error){
      return res.json(error);
    });
  } else {
    res.json({status: 'No params received.'});
  }
};


exports.show = function(req,res) {

  // get agenda based on voOot-agenda-id;
  models.Agenda.find({
    where: {
      id: req.params.id
    },
    include: [
      { model: models.agendaItems, as: 'items' }
    ]
  }).then(function(result){
    return res.json(result);
  }).catch(function(error){
    return res.json(error);
  });
};

exports.create = function(req,res) {

};

exports.update = function(req,res) {

};

exports.destroy = function(req,res) {

};

exports.sync = function(req,res) {

    // get event-identifier for agenda
    models.Agenda.findOne({
      where: { id: req.params.id },
      include: [
        { model: models.Event,
          as: 'event',
          include: [
            { model: models.Identifier, as: 'identifiers', attributes: ['scheme', 'identifier'] }
          ]
        },
      ]
    }).then(function(event){
      if (!event) { return res.json(event); }

      // Get ori_identifier for this event.
      var id = event.dataValues.identifiers[0].identifier || null;
      if (!id) { return res.json(null); }


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
