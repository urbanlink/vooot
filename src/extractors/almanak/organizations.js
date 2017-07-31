'use strict';

// Extracts all municipalities from the Almanak.
// Returns an array with all almanak links to the municipality page.

var cheerio = require('cheerio');
var request = require('request');

var rest;
var azList = [];
var organizations = [];
var listCount = 0;

// Get the link list for alphabetic organizations list.
function getAZList(cb) {
  var source = 'https://almanak.overheid.nl/categorie/2/Gemeenten_A-Z/';
  azList.push({
    name: 'A',
    url: 'https://almanak.overheid.nl/categorie/3/A/'
  });
  request.get(source, function(err, response, body) {
    if (err) { return cb(err); }

    body = body
      .replace(/^\s+|\s+$/g, '')     // remove whitespace at beginning and end of a line
      .replace(/\r?\n|\r|\t/g, '')   // remove tabs and newlines at beginning and end of a line
    ;

    // parse body
    var $ = cheerio.load(body);

    $('#content ol.a-z li a').each(function(i,elem) {
      azList.push({
        name: $(this).text(),
        url: 'https://almanak.overheid.nl' + $(this).attr('href')
      });
    });
    cb();
  });
}

// Get organizations for an AZ item.
function getAZOrganizations(cb) {
  if ( listCount < azList.length ) {
    getOrganizationsLinks();
  } else {
    rest.json(organizations);
  }
}

// Fetch the links from an az-page
function getOrganizationsLinks() {
  var source = azList[ listCount].url;
  request.get(source, function(error, response, body) {
    body = body.replace(/^\s+|\s+$/g, '').replace(/\r?\n|\r|\t/g, '');
    var $ = cheerio.load(body);
    $('#content ul.linklist li a').each(function(i,elem) {
      organizations.push({
        name: $(this).text(),
        classification: 'municipality',
        identifiers: [
          {
            scheme: 'almanak',
            identifier: $(this).attr('href')
          }
        ]
      });
    });
    listCount++;
    getAZOrganizations();
  });
}


exports.extractMunicipalities = function(req,res,next) {
  // make res available for outside function.
  rest = res;
  // Start the loop.
  getAZList(function() {
    getAZOrganizations();
  });
};


// Fetch all organisations from the Almanak
exports.massExtractor = function(args) {
  args = args || {};
  args.classicication = args.classicication || 'municipality';

  // Fetch the list of organizations.

  // Then, fetch all the organization details.

};


// Fetch details about a specific organization
exports.itemExtractor = function(args) {

};
