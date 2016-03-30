'use strict';

// https://github.com/mysociety/popit/blob/master/lib/schemas/identifier.js

module.exports = {

  attributes: {
    identifier: {
      type: 'string',
      required: true
    },
    scheme: {
      type: 'string',
      required: true
    },


    // association with organization if needed
    organization: {
      model: 'organization'
    },

    event: {
      model: 'event'
    }

  }
};
