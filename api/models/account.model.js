'use strict';

module.exports = function(sequelize, DataTypes) {

  var Account = sequelize.define('account', {

    email: DataTypes.STRING,

    picture: DataTypes.STRING,

    name: DataTypes.STRING

  }, {
    classMethods: {
      associate: function(models) {

        // An account can follow multiple persons, and a person can be followed by multiple accounts (many-to-many)
        Account.belongsToMany(models.person, {
          through: 'person_followers',
          as:'accounts'
        });
        models.person.belongsToMany(Account, {
          through: 'person_followers',
          as:'followers'
        });

        // An account can edit multiple persons, and a person can be followed by multiple accounts (many-to-many)
        Account.belongsToMany(models.person, {
          through: 'person_editors',
          as:'persons'
        });
        models.person.belongsToMany(Account, {
          through: 'person_editors',
          as:'editors'
        });

        // An account can edit multiple persons, and a person can be followed by multiple accounts (many-to-many)
        Account.belongsToMany(models.organization, {
          through: 'organization_editors',
          as:'organisations'
        });
        models.organization.belongsToMany(Account, {
          through: 'organization_editors',
          as:'editors'
        });


        // An account can follow multiple persons, and a person can be followed by multiple accounts (many-to-many)
        Account.belongsToMany(models.event, {
          through: 'event_followers',
          as:'events'
        });
        models.event.belongsToMany(Account, {
          through: 'event_followers',
          as:'followers'
        });


      }
    }
  });

  return Account;
};
