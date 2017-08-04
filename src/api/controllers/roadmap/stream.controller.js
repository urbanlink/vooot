'use strict';

var stream = require('getstream');
var logger = require('winston');
var settings = require('../../config/settings');
var async = require('async');

var client = stream.connect(settings.stream.key, settings.stream.secret, settings.stream.appId);


// Instantiate a new stream.io feed
function feed(type,id) {
  return client.feed(type, id);
}



/**
 * Send follow activity to stream.io
 * @param {object} data Object with params: user_id, follower_id, insertId, followerType, created_at
 * @returns {object} Returns data or error
 **/
function follow(data, cb) {
  logger.info('Send follow request to stream-io');

  var userFeed = client.feed('user', data.user_id);

  // build activity object for stream feed
  var activity = {
    actor: 'user:' + data.user_id,
    verb: 'follow',
    object: data.follower_type + ':' + data.follower_id,
    foreign_id: data.follower_type + data.follower_id,
    time: data.created_at,
    to: ['notification:' + data.follower_id]
  };

  logger.info('activity: ', activity);
  // instantiate a feed using feed class 'timeline_flat' and the user id from the database
  var timeline = client.feed('timeline_flat', data.user_id);
  timeline.follow(data.follower_type, data.follower_id);

  // instantiate a feed using feed class 'timeline_aggregated' and the user id from the database
  // var timelineAggregated = client.feed('timeline_aggregated', data.user_id);
  // // Make the following connection
  // timelineAggregated.follow('user', data.follower_id);

  // add activity to the feed
  userFeed.addActivity(activity).then(function(response) {
    //log.info(response);
    cb(response);
  }).catch(function(reason) {
    logger.error(reason);
    cb(reason);
  });

}


function unfollow(data, cb) {
  // instantiate a feed using feed class 'user' and the user id from the database
  var flatFeed = streamClient.feed('timeline_flat', data.user_id);
  var aggregatedFeed = streamClient.feed('timeline_aggregated', data.user_id);
  // stop following user
  flatFeed.unfollow('user_posts', data.follower_id);
  aggregatedFeed.unfollow('user', data.follower_id);
}


// Returns the references from a list of activities
function referencesFromActivities(activitiesOrNotifications) {

  var references = {};

  activitiesOrNotifications.forEach(function(item) {
    var activities = (item.activities) ? item.activities : [item];
    activities.forEach(function(activity) {
      Object.keys(activity).forEach(function(key) {
        if (activity[key] && activity[key].indexOf && activity[key].indexOf(':') != -1) {
          var parts = activity[key].split(':');
          var reference = parts[0];
          var referenceId = parts[1];
          if (!(reference in references)) {
            references[reference] = {};
          }
          references[reference][referenceId] = 1;
        }
      });
    });
  });
  return references;
}

function loadReferencedObjects(references, userId, callback) {
    // TODO: subqueries are inneficient. Handle do i like and do i follow
    // in 2 separate queries
    var queries = [];
    // Get the reference based on the type of object
    if (references.upload) {
    //     var sql = '
    //     SELECT
    //         uploads.id AS id,
    //         users.id AS user_id,
    //         users.first_name AS first_name,
    //         users.last_name AS last_name,
    //         MD5(users.email) AS email_md5,
    //         uploads.id AS upload_id,
    //         uploads.filename AS filename,
    //         uploads.hashtags AS hashtags,
    //         uploads.caption AS caption,
    //         uploads.location AS location,
    //         IF((SELECT 1 AS liked FROM likes WHERE user_id = ? AND upload_id = uploads.id), true, false) AS liked
    //     FROM uploads
    //         LEFT JOIN users ON (uploads.user_id = users.id)
    //     WHERE uploads.id IN (?)
    // ';
    // queries.push({
    //     'name': 'upload',
    //     'sql': sql
    // });
  }
    if (references.user) {
        // do the same thing for users
        let sql = `
        SELECT
            users.id AS id,
            users.id AS user_id,
            users.first_name AS first_name,
            users.last_name AS last_name,
            MD5(users.email) AS email_md5,
            IF(
                (
                    SELECT
                        1 AS following
                    FROM followers AS f
                    WHERE f.follower_id = users.id
                        AND f.user_id = ?
                ),
                true,
                false
            ) AS following
        FROM users
        WHERE users.id IN (?)
    `;
        queries.push({
            'name': 'user',
            'sql': sql
        });
    }
    var referencedObject = {};
    // run all the queries
    async.eachSeries(queries, function iteratee(query, cb) {
        db.query(query.sql, [userId, Object.keys(references[query.name])], function(err, results) {
            if (err) {
                cb(err);
            }
            referencedObject[query.name] = {};
            results.forEach(function(result) {
                referencedObject[query.name][result.id] = result;
            });
            cb();
        });
    }, function done() {
        callback(referencedObject);
    });
}


/*
 * Enriches the activities by replacing references with the actual objects
 */
function enrichActivities(activitiesOrNotifications, refencedObjects) {
  activitiesOrNotifications.forEach(function(item) {
    var activities = (item.activities) ? item.activities : [item];
    activities.forEach(function(activity) {
      Object.keys(activity).forEach(function(key) {
        if (activity[key] && activity[key].indexOf && activity[key].indexOf(':') != -1) {
          var parts = activity[key].split(':');
          var reference = parts[0];
          var referenceId = parts[1];
          if (reference in refencedObjects && refencedObjects[reference][referenceId]) {
            activity[key] = refencedObjects[reference][referenceId];
          }
        }
      });
    });
  });
};


module.exports = {
  'feed': feed,
  //
  'follow': follow,
  'referencesFromActivities': referencesFromActivities,
  //
  'loadReferencedObjects': loadReferencedObjects,
  //
  'enrichActivities': enrichActivities
};







// Get activities from 5 to 10 (slow pagination)
//user1.get({limit:5, offset:5}, callback);
// (Recommended & faster) Filter on an id less than a given UUID
//user1.get({limit:5, id_lt:"e561de8f-00f1-11e4-b400-0cc47a024be0"});

// All API calls are performed asynchronous and return a Promise object
// user1.get({limit:5, id_lt:"e561de8f-00f1-11e4-b400-0cc47a024be0"})
//     .then(function(body) { /* on success */ })
//     .catch(function(reason) { /* on failure, reason.error contains an explanation */ });

// // Create a new activity
// activity = {'actor': 1, 'verb': 'tweet', 'object': 1, 'foreign_id': 'tweet:1'};
// user1.addActivity(activity);
// // Create a bit more complex activity
// activity = {'actor': 1, 'verb': 'run', 'object': 1, 'foreign_id': 'run:1',
//     'course': {'name': 'Golden Gate park', 'distance': 10},
//     'participants': ['Thierry', 'Tommaso'],
//     'started_at': new Date()
// };
// user1.addActivity(activity);
//
// // Remove an activity by its id
// user1.removeActivity("e561de8f-00f1-11e4-b400-0cc47a024be0");
// // or remove by the foreign id
// user1.removeActivity({foreignId: 'tweet:1'});
//
// // mark a notification feed as read
// notification1 = client.feed('notification', '1');
// var params = {mark_read: true};
// notification1.get(params);
//
// // mark a notification feed as seen
// var params = {mark_seen:true};
// notification1.get(params);
//
// // Follow another feed
// user1.follow('flat', '42');
//
// // Stop following another feed
// user1.unfollow('flat', '42');
//
// // Stop following another feed while keeping previously published activities
// // from that feed
// user1.unfollow('flat', '42', { keepHistory: true });
//
// // Follow another feed without copying the history
// user1.follow('flat', '42', { limit: 0 });
//
// // List followers, following
// user1.followers({limit: '10', offset: '10'});
// user1.following({limit: '10', offset: '0'});
//
// // all methods support callback as the last argument
// user1.follow('flat', '42');
//
// // adding multiple activities
// activities = [
//     {'actor': 1, 'verb': 'tweet', 'object': 1},
//     {'actor': 2, 'verb': 'tweet', 'object': 3},
// ];
// user1.addActivities(activities);
//
// // specifying additional feeds to push the activity to using the to param
// // especially usefull for notification style feeds
// to = ['user:2', 'user:3'];
// activity = {'to': to, 'actor': 1, 'verb': 'tweet', 'object': 1, 'foreign_id': 'tweet:1'};
// user1.addActivity(activity);
//
// // adding one activity to multiple feeds
// var feeds = ['flat:1', 'flat:2', 'flat:3', 'flat:4'];
// activity = {
//   'actor': 'User:2',
//   'verb': 'pin',
//   'object': 'Place:42',
//   'target': 'Board:1'
// };
//
// client.addToMany(activity, feeds);
//
// // Batch create follow relations (let flat:1 follow user:1, user:2 and user:3 feeds in one single request)
// var follows = [
//   {'source': 'flat:1', 'target': 'user:1'},
//   {'source': 'flat:1', 'target': 'user:2'},
//   {'source': 'flat:1', 'target': 'user:3'}
// ];
//
// client.followMany(follows);
//
// // creating a feed token server side
// token = user1.token;
// // passed to client via template or api and initialized as such
// user1 = client.feed('user', '1', token);
//
// // creating a read-only feed token server side
// readonlyToken = client.feed('user', '1').getReadOnlyToken();
// // passed to client via template or api and initialized as such
// user1 = client.feed('user', '1', readonlyToken);
//
// // Create redirect urls
// var impression = {
//     'content_list': ['tweet:1', 'tweet:2', 'tweet:3'],
//     'user_data': 'tommaso',
//     'location': 'email',
//     'feed_id': 'user:global'
// };
// var engagement = {
//     'content': 'tweet:2',
//     'label': 'click',
//     'position': 1,
//     'user_data': 'tommaso',
//     'location': 'email',
//     'feed_id':
//     'user:global'
// };
// var events = [impression, engagement];
// var redirectUrl = client.createRedirectUrl('http://google.com', 'user_id', events);
