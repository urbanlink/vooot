'use strict';

var cheerio = require('cheerio');
var request = require('request');

// input: organisation identifier + event identifier

module.exports.parseEvent = function(options, cb) {
    var o = options || {};
    console.log('options', o);
    if (!o.organization_identifier) { return cb({msg: 'organization_identifier missing. '}); }
    if (!o.event_identifier) { return cb({msg: 'event_identifier missing. '}); }

    var source = 'http://' + o.organization_identifier + '.raadsinformatie.nl/vergadering/' + o.event_identifier;

    request.get(source, function(err, response, body) {

      if (err) { return cb(err); }

      // Container for agenda-items
      var items = [];
      // Container for documents
      var documents = [];
      // Clean up output
      body = body
        .replace(/^\s+|\s+$/g, '')     // remove whitespace at beginning and end of a line
        .replace(/\r?\n|\r|\t/g, '')   // remove tabs and newlines at beginning and end of a line
        //.replace(/[^a-zA-Z ]/g, "")
        //.toLowerCase()
      ;

      // parse body
      var $ = cheerio.load(body);

      // // Definition of an agenda item.
      // var item = {
      //   type: null, // point, heading
      //   prefix: null, // null, count, tkn
      //   title: null, //
      //   identifier: null, // notubiz identifier ai_9999
      //   agenda_id: null
      // };
      // // Definition of a document
      // var document = {
      //   type: null,
      //   mime_type: null,
      //   title: null,
      //   agendaitem_id: null
      // };

      // Get each agenda_item
      $('#agenda ul.agenda_items li.agenda_item').each(function(i,elem) {
        var item = {
          type: null,
          order: items.length +1,
          documents: []
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
        $(this).find('.agenda_item_content ul.documents li').each(function(i,elem) {
          // Get the identifier
          var identifier = $(this).find('a').attr('href').split('/');
          identifier = identifier[ identifier.length -2];
          // setup the document
          var document = {
            type: $(this).find('.document_type').text(),
            title: $(this).find('.document_title').text(),
            source: $(this).find('a').attr('href'),
            mime_type: 'application/pdf',
            identifier: identifier
          };
          item.documents.push(document);
        });

        items.push(item);
      });

      // Send back the result
      return cb(null, items);
    });
  };
