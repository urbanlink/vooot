voOot API
=================

[![Join the chat at https://gitter.im/urbanlink/vooot](https://badges.gitter.im/urbanlink/voOot.svg)](https://gitter.im/urbanlink/vooot?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# Documentation
Documentation is available at [vooot.nl/documentation](https://vooot.nl/documentation).


# Installation

- ensure [nodejs](nodejs.org) is installed
- ensure [SailsJS](https://sailsjs.com) is installed
- npm install
- sails lift
- App running at: http://localhost:1337/


# Backend
## Collections manipulation flow

- Frontend uses `Meteor.call` to insert, update or remove documents in a collection.
- Backend checks if the logged in user is authorised to perform the given operation (inside a Meteor method).
- Backend saves document in mongodb
- Backend emits an event that corresponds with the given CRUD operation, e.g. `inserted, updated or removed` (inside a Meteor method).
- Handlers are created that have to react to these created events, for instance when inserting an update or notification.

# Fixtures

# Unit / Integration tests

## Database
- Connecting: `mongo "<host>/<database>" -u "<user>" -p "<password>"`
- Dumping: `mongodump "<host>" --db "<database>" -u "<user>" -p "<password>" -o \`date +%s\``
- Restoring: `mongorestore "<host>" --db "<database>" -u "<user>" -p "<password>"`
- Emptying all Collections (run in mongo shell): `db.getCollectionNames().forEach(function(collectionName) { db[collectionName].remove({}); });`
- Make user (super)admin: `db.users.update({ '_id': '<insertuseridhere>' }, { $set: { 'roles': ['admin'] } })`
- Find faulty / wrongly uploaded pictures: `db.getCollection('cfs.images.filerecord').find({'copies':{$exists:false}})`

## Unit testing

## Required server environment variables
```
NODE_ENV
DB_URL
ROOT_URL
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_BUCKET_REGION
AWS_BUCKET_NAME
TZ = Europe/Amsterdam
MAIL_URL
GOOGLE_API_KEY
```

## data dumps

### clean userdump
- regular mongo dump command
- unpack bson `for f in *.bson; do bsondump "$f" > "$f.json"; done`
- `cat users.bson.json | sed 's/accessToken" : "[^"]*"/accessToken" : ""/g' > users.bson-clean.json`
- `cat users.bson-clean.json | sed 's/hashedToken" : "[^"]*"/hashedToken" : ""/g' > users.bson-clean-2.json`
- `cat users.bson-clean-2.json | sed 's/bcrypt" : "[^"]*"/bcrypt" : ""/g' > users.bson-clean-3.json`
- `cat users.bson-clean-3.json | sed 's/token" : "[^"]*"/token" : ""/g' > users.bson-clean-4.json`


# License

Copyright (C) 2016 urbanlink

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.

An interactive user interface displays "Appropriate Legal Notices" to the
extent that it includes a convenient and prominently visible feature
that (1) displays an appropriate copyright notice, and (2) tells the user
that there is no warranty for the work (except to the extent that warranties
are provided), that licensees may convey the work under this License, and
how to view a copy of this License. If the interface presents a list of user
commands or options, such as a menu, a prominent item in the list meets this
criterion.
