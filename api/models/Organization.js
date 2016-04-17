'use strict';

module.exports = function(sequelize, DataTypes) {

  var Organization = sequelize.define('Organization', {

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    summary: DataTypes.TEXT,
    founding_date: DataTypes.DATE,
    dissolution_date: DataTypes.DATE,

    classification: DataTypes.STRING,

    former_name: DataTypes.STRING,

    // voOot
    last_sync_date: DataTypes.DATE
    
  }, {
    classMethods: {
      associate: function(models) {
        Organization.belongsTo(Organization, {
          foreignKey: 'organization_id',
          as: 'parent'
        });

        Organization.hasMany(models.Identifier, {
          as: 'identifiers'
        });

        Organization.hasMany(models.Event, {
          as: 'events'
        });
      }
    }
  });

  return Organization;
};
