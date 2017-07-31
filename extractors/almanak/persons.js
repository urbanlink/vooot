'use strict';

// Get persons from the almanak for an organisation
var cheerio = require('cheerio');
var request = require('request');



exports.extractPersons = function(req,res) {
  var source = req.query.source;
  var list = [];

  request.get(source, function(err, response, body) {
    if (err) { return res.json(err); }
    body = body
      .replace(/^\s+|\s+$/g, '')     // remove whitespace at beginning and end of a line
      .replace(/\r?\n|\r|\t/g, '')   // remove tabs and newlines at beginning and end of a line
    ;
    var $ = cheerio.load(body);
    $('ul.definitie li').each(function(i,elem) {
      var t = $(this).text();
      t = t.substr(0,8);
      if (t==='Raadslid') {
        $(this).find('ul li a').each(function(i,elem) {
          var k = $(this).text();
          k = k.split('(');
          var name = k[0];
          name = name.replace(/^\s+|\s+$/g, '');
          var party = k[1];
          party = party.replace(')', '');
          var gender = name.substr(0,4);
          if (gender==='Dhr.') {
            gender='male';
          } else {
            gender='female';
          }
          name = name.replace('Dhr. ', '');
          name = name.replace('Mw. ', '');
          list.push({
            name: name,
            gender: gender,
            memberships: [
              {
                municipality: source,
                role: 'raadslid'
              },
              {
                party: party,
                role: 'member'
              }
            ],
            identifiers: [{
              scheme: 'almanak',
              identifier: $(this).attr('href')
            }]
          });
        });

      }
    });
    return res.json(list);
  });
};


exports.extractPerson = function(req,res) {
  var source=req.query.source;
  var person={};

  request.get(source, function(err,response,body) {
    if (err) { return res.json(err); }
    body = body.replace(/^\s+|\s+$/g, '').replace(/\r?\n|\r|\t/g, '');
    var $ = cheerio.load(body);

  });
};



exports.massExtractor = function(args) {

};

exports.itemExtractor = function(args) {

};
