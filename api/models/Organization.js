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

    // ori_provider: DataTypes.STRING,
    // ori_source: DataTypes.STRING,

    // meta: DataTypes.TEXT,

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
      }
    }
  });

  return Organization;
};
