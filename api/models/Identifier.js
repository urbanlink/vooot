'use strict';

module.exports = function(sequelize, DataTypes) {

  var Identifier = sequelize.define('Identifier', {

    scheme: {
      type: DataTypes.STRING,
      allowNull: false
    },
    identifier: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        Identifier.belongsTo(models.Organization, {
          foreignKey: 'organization_id',
          as: 'organization'
        });
        Identifier.belongsTo(models.Event, {
          foreignKey: 'event_id',
          as: 'event'
        });
      }
    }
  });

  return Identifier;
};
