# voOot Technology Stack

## Summary

  - [Digital Ocean](http://digitalocean.com)
  - [Ubuntu 16.04 LTS](http://releases.ubuntu.com/16.04/)
  - [NGINX](http://nginx.com)
  - [NodeJS](https://nodejs.org)
  - [PM2](https://github.com/Unitech/pm2)
  - [MySQL](https://www.mysql.com/)
  - [Sendgrid](https://sendgrid.com)
  - [Amazon S3](https://aws.amazon.com/s3/)
  - [Angular](https://angular.io)
  - [SequelizeJS](https://sequelizejs.com)


## Server
We run the [voOot API](https://api.vooot.nl) on a [Digital Ocean](http://digitalocean.com) droplet running [Ubuntu 16.04 LTS](http://releases.ubuntu.com/16.04/)
The webserver is [NGINX](http://nginx.com) which proxies the api to the webserver port.
Server installation is done by running 'config/bootsrap.sh'.

## Backend Framework
The API is a NodeJS custom API. In the production environment the application is run using [PM2](https://github.com/Unitech/pm2).

## Database technology
The voOot API is run using a [MySQL](https://www.mysql.com/) database.

## Authentication
We use JWT and PassportJS for authentication.

## Email
Email is sent by using the [Sendgrid](https://sendgrid.com) service.

## File storage
Files are stored and retrieved using [Amazon S3](https://aws.amazon.com/s3/).

## CRON
Currently cron is not being used.
