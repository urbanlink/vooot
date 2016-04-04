'use strict';

var path = require('path');
var env = {};

try {
  env = require('./env.js');
} catch (err) { }

module.exports = {

  root          : path.normalize(__dirname + '/..'),

  environment   : process.env.NODE_ENV              || env.NODE_ENV                || 'development',
  port          : process.env.NODE_API_PORT         || env.NODE_API_PORT           || 8000,

  database : {
    host        : process.env.DATABASE_HOST         || env.DATABASE_HOST           || 'localhost',
    database    : process.env.DATABASE_DATABASE     || env.DATABASE_DATABASE       || 'voootapi',
    username    : process.env.DATABASE_USERNAME     || env.DATABASE_USERNAME       || 'voootapi',
    password    : process.env.DATABASE_PASSWORD     || env.DATABASE_PASSWORD       || 'voootapi',
    port        : process.env.DATABASE_PORT         || env.DATABASE_PORT           || '3306',
    dialect     : process.env.DATABASE_DIALECT      || env.DATABASE_DIALECT        || 'mysql'
  },

  sendgrid : {
    key         : process.env.SENDGRID_API_KEY      || env.SENDGRID_API_KEY        || '',
  },

  aws: {
    key         : process.env.AWS_ACCESS_KEY_ID     || env.AWS_ACCESS_KEY_ID       || '',
    secret      : process.env.AWS_SECRET_ACCESS_KEY || env.AWS_SECRET_ACCESS_KEY   || '',
    bucket      : process.env.AWS_S3_BUCKET_NAME    || env.AWS_S3_BUCKET_NAME      || '',
    endpoint    : process.env.AWS_S3_ENDPOINT       || env.AWS_S3_ENDPOINT         || '',
  }
};
