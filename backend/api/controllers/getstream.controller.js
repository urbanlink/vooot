'use strict';

var models = require('../models/index');
var settings = require('../../config/settings');
var logger = require('../../config/logger');
var utils = require('../utils');
var FeedManager = require('../../config/stream').feedManager;


//creates read only token from sever client for a specific feed.
exports.getReadOnlyToken = function(req,res,next) {
  return res.json(FeedManager.getFeed(req.body.feedType, String(req.body.feedId)).getReadOnlyToken());
};


// Get a feed
exports.getFeed = function(req,res,next) {
  FeedManager.getFeed(req.query.feedType, req.query.feedId).get().then(function(result) {
    res.json(result);
  }).catch(function(err) {
    utils.handleError(res,err);
  });
};


exports.createActivity = function(req,res,next) {
  logger.log('Creating new activity.');
  /*
  {
    actor: 'user:1',            // is the user id of the person performing the activity.
    verb: 'tweet',              // Verb is the type of activity the actor is engaging in.
    tweet: 'nice work @john',   // Tweet is a custom field containing the message.
    object: 1                   // Object is the id of the tweet object in your database.
    to: [
      'notification:john'
    ]

  }
  */
  var activity = req.body;
  var feedType = activity.actor.split(':')[0];
  var feedId = activity.actor.split(':')[1];
  var feed = FeedManager.getFeed(feedType, feedId);
  console.log(activity);
  feed.addActivity(activity);
  // Trigger notification if needed

  return res.json(activity);
};


// Add an item to the following list for the current user at getstream.io
exports.follow = function(userId, type, followId) {
  var userTimeline = FeedManager.getFeed('timeline', userId);
  userTimeline.follow(type, followId);
};

// Remove an item to the following list for thecurrent user at getstream.io
exports.unfollow = function(userId, type, followId) {
  var userTimeline = FeedManager.getFeed('timeline', userId);
  userTimeline.unfollow(type, followId);
};
