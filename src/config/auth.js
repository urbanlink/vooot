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
      },
      attributes: ['id', 'password', 'salt', 'verified'],
      // include roles
      include: [{
        model: models.account_role,
        as: 'roles',
        attributes: ['type_id']
      }]
    }).then(function(account) {
      if (!account) { return done({ msg: 'Account not found.'}, false); }
      var hashedPassword = bcrypt.hashSync(password, account.dataValues.salt);
      if (account.dataValues.password === hashedPassword) {
        if (account.dataValues.verified!==true) {
          return done({ msg: 'Account is not yet activated. Please activate using the activation_key. '}, false);
        }
        // Restucture account roles
        var a = account.dataValues;
        var r = account.dataValues.roles;
        a.roles= [];
        for (var i=0; i<r.length;i++) {
          a.roles.push(r[ i].dataValues.type_id);
        }
        // a.roles = a.roles.join(',');
        delete a.password;
        delete a.salt;
        delete a.verified;
        return done(null, a);
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
exports.serializeClient = function(req, res, next) {
  // add a new client to the database
  // we store information needed in token in req.user
  // add the id of the authClient to the user object
  models.account_authclient.create({
    account_id: req.user.id
  }).then(function(result) {
    req.user.clientId = result.dataValues.id;
    next();
  });
};


// Generate an access token.
exports.generateAccessToken = function(req, res, next) {
  req.token = req.token ||  {};
  req.token.expires_in = settings.jwt.tokenTime;

  req.token.access_token = jwt.sign({
    id: req.user.id,
    clientId: req.user.clientId,
    roles: req.user.roles
  }, settings.jwt.secret, {
    expiresIn: settings.jwt.tokenTime
  });
  next();
};

// Generate a refresh token. Only invoked after succesfull login.
exports.generateRefreshToken = function(req, res, next) {
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
};

// Validate if a refreshtoken is valid. If refreshtoken exists in database and connected account is valid
exports.validateRefreshToken = function(req, res, next) {

  // find the autheclient and the connected account
  models.account_authclient.findOne({
    where: {
      refreshtoken: req.body.refresh_token
    },
    attributes: ['id', 'account_id'],
    include: [{
      model: models.account,
      as: 'account',
      attributes: ['id','email','picture','name'],
      include: [{
        model: models.account_role,
        as: 'roles',
        attributes: ['type_id']
      }]
    }]
  }).then(function(result) {
    if (!result) { return next('no client found. '); }
    if (!result.dataValues.account.dataValues.id) { return next('No account found for this refresh token. '); }

    // add user_id and client_id to the request header
    var account = result.dataValues.account.dataValues;
    account.clientId = result.dataValues.id;
    account.profile = {
      picture: account.picture,
      name: account.name
    };
    delete account.picture;
    delete account.name;

    var roles = account.roles;
    account.roles = [];

    req.user = {};
    for (var i=0; i<roles.length;i++) {
      account.roles.push(roles[ i].dataValues.type_id);
    }

    req.user = account;

    next();
  }).catch(function(err) {
    return next(err);
  });
};

exports.rejectToken = function(req, res, next) {
  models.account_authclient.destroy({
    where: {
      refreshtoken: req.body.refresh_token
    }
  }).then(function(result){
    res.json({ result: result });
  });
};


exports.isAdmin = function(account) {
  console.log(account);
  if ( account && (account.roles.indexOf(1) !== -1) ) {
    return true;
  }
  return false;
};

exports.isEditor = function(account) {

};
exports.hasRole = function(account) {

};
