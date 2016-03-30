'use strict';

// https://github.com/mysociety/popit/blob/master/lib/schemas/other-name.js
module.exports = {
  attributes: {
    url: {
      type: 'string',
      required: true
    },
    note: {
      type: 'text' 
    },

    organization: {
      model: 'organization'
    }
  }
};
