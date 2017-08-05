// auth.js

var settings = require("./settings.js");
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var logger = require('./logger');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var models = require('../api/models');
var bcrypt = require('bcrypt');
var utils = require('../../src/api/utils');
logger.info('Setting up passport strategy');

// Account auth settings

var authSettings = {
  registration: true,
  activation: true
};

// PASSPORT
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new LocalStrategy(
  function(email, password, done) {
    models.account.findOne({
      where: {
        'email': email
      }
    }).then(function(account) {

      if (!account) { return done({ msg: 'Account not found.'}, false); }

      var hashedPassword = bcrypt.hashSync(password, account.dataValues.salt);
      if (account.dataValues.password === hashedPassword) {
        console.log(account.dataValues.verified);
        if (account.dataValues.verified!==true) {
          return done({ msg: 'Account is not yet activated. Please activate using the activation_key. '}, false);
        }
        return done(null, account.dataValues);
      }

      return done({ msg: 'Incorrect credentials.'}, false);
    }).catch(function(err) {
      return done(err, false);
    });
  }
));


// HELPER
// function serializeUser(req,res,next) {
//   console.log('serializing user');
//   console.log(req.user);
//   // db.user.updateOrCreate(req.user, function(err, user) {
//   //   if (err) {
//   //     return next(err);
//   //   }
//     // we store information needed in token in req.user
//     // req.user = {
//     //   id: user.id
//     // };
//     next();
//   // });
// }


// Add a new client to the db. Create a new client for each new login.
// old clients should be removed by cron or something like that
function serializeClient(req, res, next) {
  // add a new client to the database
  // we store information needed in token in req.user
  // add the id of the authClient to the user object
  models.account_authclient.create({
    account_id: req.user.id
  }).then(function(result) {
    req.user.clientId = result.dataValues.id;
    next();
  });
}


// Token generation
function generateAccessToken(req, res, next) {
  req.token = req.token ||  {};
  req.token.expires_in = settings.jwt.tokenTime;
  req.token.access_token = jwt.sign({
    id: req.user.id,
    clientId: req.user.clientId
  }, settings.jwt.secret, {
    expiresIn: settings.jwt.tokenTime
  });
  next();
}

function generateRefreshToken(req, res, next) {
  // generate a new refreshtoken
  req.token.refresh_token = req.user.clientId.toString() + '.' + utils.randomAsciiString(40);
  // save the refreshtoken in the database
  models.account_authclient.update({
    refreshtoken: req.token.refresh_token
  }, {
    where: {
      id: req.user.clientId
    }
  }).then(function(result) {
    next();
  }).catch(function(err){
    return next(err);
  });
}

function validateRefreshToken(req, res, next) {
  models.account_authclient.findOne({
    where: {
      refreshtoken: req.body.refresh_token
    }
  }).then(function(result) {
    if(!result) { return next('no client found. '); }
    req.user = result.dataValues;
    next();
  }).catch(function(err) {
    return next(err);
  });
}


function rejectToken(req, res, next) {
  models.account_authclient.destroy({
    where: {
      refreshtoken: req.body.refresh_token
    }
  }).then(function(result){
    res.json({ result: result });
  });
}



module.exports = {
  serializeClient: serializeClient,
  generateRefreshToken: generateRefreshToken,
  validateRefreshToken: validateRefreshToken,
  generateAccessToken: generateAccessToken,
  rejectToken: rejectToken
};
