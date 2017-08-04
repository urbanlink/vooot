// auth.js

var logger = require('./logger');
var passport = require("passport");
var passportJWT = require("passport-jwt");
var settings = require("./settings.js");
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
var params = {
    secretOrKey: settings.jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeader()
};

module.exports = function() {
  logger.info('Setting up strategy');
  var strategy = new Strategy(params, function(payload, done) {
    if (payload.id) {
      return done(null, {
        id: payload.id
      });
    } else {
      return done(new Error("User not found"), null);
    }
  });

  passport.use(strategy);

  // passport.serializeUser(function(user, done) {
  //   done(null, user);
  // });
  //
  // passport.deserializeUser(function(user, done) {
  //   done(null, user);
  // });

  return {
    initialize: function() {
      logger.info('Initializing auth');
      return passport.initialize();
    },
    authenticate: function() {
      var session = (settings.jwt.session == 'true');
      return passport.authenticate('jwt', session);
    }
  };
};
