'use strict';


// http://www.popoloproject.com/specs/organization.html
// https://github.com/mysociety/popit/blob/master/lib/schemas/organization.js

/**

Gemeente Den Haag
  Gemeenteraad 2014-2018
    Commissie Ruimte
    Commissie Bestuur

**/
module.exports = {
  attributes: {
    // The organization's most well known name
    name: {
      type: 'string',
      required: true,
      // trim: true
    },

    // A brief bit of text to help identify the organization
    summary: {
      type: 'text',
    },

    founding_date: { type: 'datetime' },
    dissolution_date: {  type: 'datetime' },

    classification: { type: 'string' },

    parent_id: {
      model: 'organization'
    },

    former_name: {
      type: 'string'
    },

    // Meta information. for use with a list of api sources. e.g. source.com/api/calendar.
    /*
    "meta": {
        "source_provider": "notubiz",
        "sources": {
            "events": "https://api.denhaag.nl/events",
            
        }
    }
    */
    meta: {
      type: 'array'
    },


    // Associations
    identifiers: {
      collection: 'identifier',
      via: 'organization'
    },

    other_names: {
      collection: 'othername',
      via: 'organization'
    },

    contact_details: {
      collection: 'contactdetail',
      via: 'organization'
    },

    image: {
      collection: 'image',
      via: 'organization'
    },

    links: {
      collection: 'link',
      via: 'organization'
    }
  },
};
