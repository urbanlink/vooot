'use strict';

module.exports = function(sequelize, DataTypes) {

  var Model = sequelize.define('account', {

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false
    },

    salt: {
      type: DataTypes.STRING,
      allowNull: false
    },

    activationkey: {
        type: DataTypes.STRING,
        allowNull: true
    },

    resetpasswordkey: {
        type: DataTypes.STRING,
        allowNull: true
    },

    verified: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },

    picture: DataTypes.STRING,

    name: DataTypes.STRING

  });

  Model.associate = function(models) {

    // account logged in clients
    Model.hasMany(models.account_authclient, {
      as:'clients'
    });



    // // An account can follow multiple persons, and a person can be followed by multiple accounts (many-to-many)
    // Model.belongsToMany(models.person, {
    //   through: 'person_followers',
    //   as:'accounts'
    // });
    // models.person.belongsToMany(Model, {
    //   through: 'person_followers',
    //   as:'followers'
    // });
    //
    // // An account can follow multiple organizations, and an organization can be followed by multiple accounts (many-to-many)
    // Model.belongsToMany(models.organization, {
    //   through: 'organization_followers',
    //   as:'accounts'
    // });
    // models.organization.belongsToMany(Model, {
    //   through: 'organization_followers',
    //   as:'followers'
    // });
    //
    // // An account can edit multiple persons, and a person can be followed by multiple accounts (many-to-many)
    // Model.belongsToMany(models.person, {
    //   through: 'person_editors',
    //   as:'persons'
    // });
    // models.person.belongsToMany(Model, {
    //   through: 'person_editors',
    //   as:'editors'
    // });
    //
    // // An account can edit multiple persons, and a person can be followed by multiple accounts (many-to-many)
    // Model.belongsToMany(models.organization, {
    //   through: 'organization_editors',
    //   as:'organisations'
    // });
    // models.organization.belongsToMany(Model, {
    //   through: 'organization_editors',
    //   as:'editors'
    // });
    //
    // // An account can follow multiple persons, and a person can be followed by multiple accounts (many-to-many)
    // Model.belongsToMany(models.event, {
    //   through: 'event_followers',
    //   as:'events'
    // });
    // models.event.belongsToMany(Model, {
    //   through: 'event_followers',
    //   as:'followers'
    // });
  };

  return Model;
};
