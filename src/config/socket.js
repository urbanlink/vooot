'use strict';

var settings = require('./settings');
var logger = require('winston');

module.exports = function(server) {

  var io = require('socket.io')(server);

  var numUsers = 0;
  io.on('connection', function (socket) {
    logger.debug('[Socket] - A user connected');
    var addedUser = false;

    // when the user disconnects.. perform this
    socket.on('disconnect', function(){
      logger.debug('[Socket] - User disconnected');
      if (addedUser) {
        numUsers--;

        // echo globally that this client has left
        socket.broadcast.emit('user left', {
          username: socket.username,
          numUsers: numUsers
        });
      }
    });

    // when the client emits 'new message', this listens and executes
    socket.on('new message', function (data) {
      logger.debug('New message ', data, socket.username);
      // we tell the client to execute 'new message'
      socket.broadcast.emit('new message', {
        username: socket.username,
        message: data
      });
    });

    socket.on('add user', function(username) {
      socket.username = username;
      numUsers++;
      addedUser = true;
      socket.emit('login', {
        numUsers: numUsers,
        username: username
      });
      // echo globally (all clients) that a person has connected
      socket.emit('user joined', {
        username: socket.username,
        numUsers: numUsers
      });
    });

    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', function () {
     socket.broadcast.emit('typing', {
       username: socket.username
     });
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', function () {
     socket.broadcast.emit('stop typing', {
       username: socket.username
     });
    });
  });
};
