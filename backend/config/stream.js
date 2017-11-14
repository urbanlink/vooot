'use strict';

var settings = require('./settings');
var streamNode = require('getstream-node');


var config = {
  // GetStream.io API key
  apiKey: settings.getStream.key,
  // GetStream.io API Secret
  apiSecret: settings.getStream.secret,
  // GetStream.io API App ID
  apiAppId: settings.getStream.appId,
  // GetStream.io API Location
  apiLocation: settings.getStream.location,
  // GetStream.io User Feed slug
  userFeed: 'user',
  // GetStream.io Notification Feed slug
  notificationFeed: 'notification',
  newsFeeds: {
    // GetStream.io Flat Feed slug
    flat: 'timeline',
    // GetStream.io Aggregated Feed slug
    aggregated: 'timeline_aggregated'
  },

  // type of backend to load
  backend: 'sequelize'
};


// After receiving a list of activities,
// enrich them by querying the object-references in our own database.
// var enrichActivities = function(body) {
//   var activities = body.results;
//   return streamBackend.enrichActivities(activities);
// };

module.exports.config = config;

module.exports.feedManager = streamNode.FeedManager(config);
