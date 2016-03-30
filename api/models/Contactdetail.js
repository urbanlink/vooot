'use strict';

// https://github.com/mysociety/popit/blob/master/lib/schemas/other-name.js
module.exports = {
  attributes: {
    label: {
      type: 'string',
    },
    type: {
      type: 'string',
      required: true
    },
    value: {
      type: 'string',
      required: true
    },
    node: {
      type: 'string'
    },
    organization: {
      model: 'organization'
    }
  }
};
