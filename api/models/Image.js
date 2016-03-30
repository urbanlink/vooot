'use strict';

// https://github.com/mysociety/popit/blob/master/lib/schemas/other-name.js
module.exports = {
  attributes: {
    created:   {
      type: 'datetime',
      defaultsTo: Date.now
    },
    url:       { type: 'string' } ,
    source:    { type: 'string' } ,
    license:   { type: 'string' } ,
    note:      { type: 'string' } ,
    mime_type: { type: 'string' } ,

    organization: {
      model: 'organization'
    }
  }
};
