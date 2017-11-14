'use strict';

var path = require('path');
var env = {};

try {
  env = require('./env.js');
} catch (err) { }

module.exports = {

  root : path.normalize(__dirname + '/..'),

  version: '0.3.1',

  environment : process.env.NODE_ENV || env.NODE_ENV || 'development',
  port : process.env.NODE_API_PORT || env.NODE_API_PORT || 8000,
  domain : process.env.DOMAIN || env.DOMAIN || 'http://localhost:8000',

  db : {
    sync: process.env.DATABASE_SYNC || env.DATABASE_SYNC || false,
    forceSync: process.env.DATABASE_FORCE_SYNC || env.DATABASE_FORCE_SYNC || false,
    name: process.env.DATABASE_NAME || env.DATABASE_NAME || 'database',
    username: process.env.DATABASE_USERNAME || env.DATABASE_USERNAME || 'username',
    password: process.env.DATABASE_PASSWORD || env.DATABASE_PASSWORD || 'password',
    port: process.env.DATABASE_PORT || env.DATABASE_PORT || '3306',
    settings: {
      host: process.env.DATABASE_HOST || env.DATABASE_HOST || 'localhost',
      dialect: process.env.DATABASE_DIALECT      || env.DATABASE_DIALECT        || 'mysql',
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      },
      logging: false,
      define: {
        underscored: true,
        timestamps: true,
        freezeTableName: true
      }
    }
  },

  jwt : {
    secret: process.env.JWT_SECRET || env.JWT_SECRET || '12345',
    session: process.env.JWT_SESSION || env.JWT_SESSION || 'false',
    tokenTime: process.env.JWT_TOKENTIME || env.JWT_TOKENTIME || 120 * 60
  },

  admin: {
    name: 'Arn van der Pluijm',
    email: 'arn@urbanlink.nl'
  },

  mail : {
    sendgridKey : process.env.SENDGRID_API_KEY || env.SENDGRID_API_KEY || '',
  },

  getStream: {
    key: process.env.GETSTREAM_API_KEY || env.GETSTREAM_API_KEY || '',
    secret: process.env.GETSTREAM_API_SECRET || env.GETSTREAM_API_SECRET || '',
    appId: process.env.GETSTREAM_APPID || env.GETSTREAM_APPID || '',
    location: process.env.GETSTREAM_LOCATION || env.GETSTREAM_LOCATION || ''
  }

};
