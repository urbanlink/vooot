'use strict';

// https://github.com/mysociety/popit/blob/master/lib/schemas/other-name.js
module.exports = {
  attributes: {
    name: {
      type: 'string',
      required: true,
    },
    note: {
      type: 'string'
    },
    start_date: {
      type: 'datetime'
    },
    end_date: {
      type: 'datetime'
    },
    organization: {
      model: 'organization'
    }
  }
};
