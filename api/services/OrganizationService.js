/* global Event */

'use strict';

module.exports = {
  find: function(params, next) {
    Organization
      .find()
      .exec(function(err, result) {
        if(err) { throw err; }
        next(result);
    });
  },

  findOne: function(id, next) {
    Organization
      .findOne(id)
      .exec(function(err, result) {
        if(err) { throw err; }
        next(result);
      });
  },

  create: function(organization, next){
    console.log('Creating organization: ', organization);
    Organization.create(organization).exec(function(err, result) {
      if(err) { throw err; }
      next(result);
    });
  }

};
