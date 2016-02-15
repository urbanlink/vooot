/* global Event */

'use strict';

module.exports = {
  find: function(params, next) {
    Event
      .find()
      .exec(function(err, result) {
        if(err) { throw err; }
        next(result);
    });
  },

  findOne: function(id, next) {
    Event
      .findOne()
      .exec(function(err, result) {
        if(err) { throw err; }
        next(result);
      });
  },

  create: function(event, next){
    console.log(event);
    Event.create(event).exec(function(err, result) {
      if(err) { throw err; }
      next(result);
    });
  }

};
