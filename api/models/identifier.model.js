'use strict';

module.exports = function(sequelize, DataTypes) {

  var Identifier = sequelize.define('identifier', {

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

        Identifier.belongsTo(models.organization, {
          foreignKey: 'organization_id',
          as: 'organization'
        });

        Identifier.belongsTo(models.event, {
          foreignKey: 'event_id',
          as: 'event'
        });

        Identifier.belongsTo(models.person, {
          foreignKey: 'person_id',
          as: 'person'
        });


      }
    }
  });

  return Identifier;
};
