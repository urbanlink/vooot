#!/bin/bash

export DEBIAN_FRONTEND=noninteractive

echo "Provisioning"
sudo apt-get update

# Setup hostname

# Setup timezone and locale

# Create non-root sudo user

# Install required packages
echo "Installing required packages"
sudo apt-get install -y curl nginx

# install nodejs
echo "Installing nodejs"
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install nodejs
sudo apt-get install build-essential

# Install mongodb
echo "Installing mongo"
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
service mongod status
# Import data

# Install node packages.sails, pm2,
echo "Installing sails pm2"
npm install -g sails pm2


# Setup local directories
mkdir -p /var/www/vooot/api
cd /var/www/vooot/api

# Get voOot
# git clone github.com/urbanlink.nl/vooot-api.git
# npm install
# bower install

# setup environment variables

# setup cron


# start server
# pm2 start

#
echo "Done"
