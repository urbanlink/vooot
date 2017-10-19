'use strict';

module.exports = function(sequelize, DataTypes) {

  var Model = sequelize.define('person_contact_type', {

    value: {
      type: DataTypes.STRING,
      required: true
    },

    name: {
      type: DataTypes.STRING
    },

    description: {
      type: DataTypes.TEXT
    }
  }, {
    timestamps: false
  });

  return Model;
};


/**
  Contact types:
    1 address_work
    2 address_home

    3 phone
    4 phone_mobile

    5 email_work
    6 email_home

    7 twitter
    8 facebook
    9 linkedin
    10 instagram
  */
