# voOot API Technology

## Summary

  - [Digital Ocean](http://digitalocean.com)
  - [Ubuntu 14.04 LTS](http://releases.ubuntu.com/14.04/)
  - [NGINX](http://nginx.com)
  - [NodeJS](https://nodejs.org)
  - [SailsJS](http://sailsjs.org/)
  - [PM2](https://github.com/Unitech/pm2)
  - [MongoDB](https://www.mongodb.org/)
  - [Auth0](https://auth0.com)
  - [Sendgrid](https://sendgrid.com)
  - [Amazon S3](https://aws.amazon.com/s3/)
  - [AngularJS](https://angularjs.com)


## Server
We currently run the [voOot API](https://api.vooot.nl) on a [Digital Ocean](http://digitalocean.com) droplet running [Ubuntu 14.04 LTS](http://releases.ubuntu.com/14.04/)
The webserver is [NGINX](http://nginx.com) which proxies the api to the webserver port.
Server installation is done by running [bootstrap.sh](https://github.com/urbanlink/vooot-api/blob/master/bootsrap.sh)

## Backend Framework
The API is a [SailsJS](http://sailsjs.org/) application. SailsJS is a  [NodeJS](https://nodejs.org) web framework. In the production environment the SailsJS application is run using [PM2](https://github.com/Unitech/pm2).

## Database technology
The voOot API is run using a [MongoDB](https://www.mongodb.org/) database.

## Authentication
We use the [Auth0](https://auth0.com) service for user authentication and API requests. We don't store user credentials at voOot.

## Email
Email is sent by using the [Sendgrid](https://sendgrid.com) service.

## File storage
Files are stored and retrieved using [Amazon S3](https://aws.amazon.com/s3/).

## Environment variables

    NODE_ENV
    DB_URL
    ROOT_URL
    AWS_ACCESS_KEY_ID
    AWS_SECRET_ACCESS_KEY
    AWS_BUCKET_REGION
    AWS_BUCKET_NAME
    TZ = Europe/Amsterdam
    SENDGRID_API_KEY
    GOOGLE_API_KEY

## CRON
