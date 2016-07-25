'use strict';

module.exports = function(sequelize, DataTypes) {

  var Organization = sequelize.define('organization', {

    // Type of the organisation: Municipality, Party, Committee
    classification: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // Name of the organization (public view name, e.g. Partij van de Arbeid)
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // Abbreviation of the organization (e.g. PvdA for Partij van de Arbeid)
    abbreviation: {
      type: DataTypes.STRING
    },

    image: {
      type: DataTypes.STRING
    },

    // Description of the organization
    summary: DataTypes.TEXT,

    // Date when the organization was founded
    founding_date: DataTypes.DATE,
    // Date when the organization was ended
    dissolution_date: DataTypes.DATE

  }, {
    classMethods: {
      associate: function(models) {

        // Organization.belongsTo(models.image, {
        //   as: 'logo'
        // });

        Organization.belongsTo(Organization, {
          foreignKey: 'organization_id',
          as: 'parent'
        });

        Organization.hasMany(models.identifier, {
          as: 'identifiers'
        });

        Organization.hasMany(models.event, {
          as: 'events'
        });

        // An account can edit multiple persons, and a person can be followed by multiple accounts (many-to-many)
        models.person.belongsToMany(Organization, {
          through: 'organization_persons',
          as:'organizations'
        });
        Organization.belongsToMany(models.person, {
          through: 'organization_persons',
          as:'persons'
        });

        Organization.belongsToMany(models.person, {
          through: 'membership',
          as:'memberships'
        });


        // // An account can edit multiple persons, and a person can be followed by multiple accounts (many-to-many)
        // Account.belongsToMany(models.organization, {
        //   through: 'organization_editors',
        //   as:'organisation'
        // });
        // models.organization.belongsToMany(Account, {
        //   through: 'organization_editors',
        //   as:'editors'
        // });
      }
    }
  });

  return Organization;
};
