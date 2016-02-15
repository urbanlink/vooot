/* globals sails */

'use strict';

var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

module.exports = {
    secret: sails.config.passport.jwt.secret,
    issuer: sails.config.passport.jwt.issuer,
    audience: sails.config.passport.jwt.audience,

    /**
     * Hash the password field of the passed user.
     */
    hashPassword: function (user) {
        if (user.password) {
            user.password = bcrypt.hashSync(user.password);
        }
    },

    /**
     * Compare user password hash with unhashed password
     * @returns boolean indicating a match
     */
    comparePassword: function(password, user){
        return bcrypt.compareSync(password, user.password);
    },

    /**
     * Create a token based on the passed user
     * @param user
     */
    createToken: function(user)
    {
        return jwt.sign({
                user: user.toJSON()
            },
            sails.config.passport.jwt.secret,
            {
                algorithm: sails.config.passport.jwt.algorithm,
                expiresIn: sails.config.passport.jwt.expiresIn,
                issuer: sails.config.passport.jwt.issuer,
                audience: sails.config.passport.jwt.audience
            }
        );
    }
};
