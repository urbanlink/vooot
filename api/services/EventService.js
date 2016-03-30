/* global sails, Event, Identifier */

'use strict';

module.exports = {
  find: function(params, next) {
    Event
      .find()
      .populate('identifiers')
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
  },

  updateOrCreate: function(event, next) {
    sails.log('Update or create event: ', event.identifier_scheme, event.identifier);
    event.last_sync_date = new Date();
    // check for identifier
    if (event.identifier_scheme && event.identifier) {
      sails.log('Identifier found in query.');
      Identifier
        .find({
          identifier: event.identifier.toString(),
          scheme: event.identifier_scheme
        })
        .exec(function(err, identifier) {
          if (err) { return next(err); }

          if (!identifier || identifier.length<1) {
            sails.log('Creating event', event);
            Event.create(event).exec(function(err, newEvent) {
              sails.log('New event created: ', newEvent);
              var i = {
                identifier: event.identifier.toString(),
                scheme: event.identifier_scheme,
                event: newEvent.id
              };
              sails.log('Creating new identifier:', i);
              Identifier.create(i).exec(function(err, result) {
                if (err) { sails.log(err); }
                sails.log('New identifier created', result);
                next();
              });
            });
          } else {
            // event exists, update it always since we don't know if anything changed.
            Event.update(identifier[ 0].event, event, function(err, result){
              if (err) {
                return next(err);
              } else {
                sails.log(result);
                next();
              }
            });
          }
        });
    }
      // get event
        // update event

        // create event

  }

};
