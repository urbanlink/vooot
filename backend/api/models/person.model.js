'use strict';

module.exports = function(sequelize, DataTypes) {

  // Setup fields
  var Model = sequelize.define('person', {

    firstname: {
      type: DataTypes.STRING,
      required: true,
    },

    lastname: {
      type: DataTypes.STRING,
      required: true,
    },

    displayname: {
      type: DataTypes.STRING
    },

    gender: {
      type: DataTypes.STRING
    },

    birthdate: {
      type: DataTypes.DATE
    },

    deathdate: {
      type: DataTypes.DATE
    },

    headshot: {
      type: DataTypes.STRING,
    },

    summary: {
      type: DataTypes.STRING,
    },

    biography: {
      type: DataTypes.TEXT,
    }
  });


  // Setup associations
  Model.associate = function(models) {

    // Identifiers for a person
    Model.hasMany(models.identifier, {
      as: 'identifiers'
    });
    // Other names
    Model.hasMany(models.person_othername, {
      as: 'othernames'
    });
    // Contact information
    Model.hasMany(models.person_contact, {
      as: 'contacts'
    });
    // Links for this person
    Model.hasMany(models.link, {
      as: 'links'
    });
    // Jobs for this person
    Model.hasMany(models.person_job, {
      as: 'jobs'
    });

    Model.belongsToMany(models.account, {
      as: 'followers',
      through: 'person_followers'
    });

  };

  return Model;
};
