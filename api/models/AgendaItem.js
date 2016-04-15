'use strict';

module.exports = function(sequelize, DataTypes) {

  var AgendaItem = sequelize.define('AgendaItem', {

    type: {
      type: DataTypes.STRING
    },
    prefix: {
      type: DataTypes.STRING
    },
    title: {
      type: DataTypes.STRING
    }
    // identifier: agenda_identifiers[ i],
    // documents: agenda_documents[ i]

  }, {
    classMethods: {
      associate: function(models) {
        // Items belong to an agenda
        AgendaItem.belongsTo(models.Agenda, {
          foreignKey: 'agenda_id',
          as: 'agenda'
        });

        // Can have multpple identifiers
        AgendaItem.hasMany(models.Identifier, {
          as: 'identifiers'
        });
        // Can have multiple files
        // AgendaItem.hasMany(models.File, {
        //   as: 'items'
        // });
      }
    }
  });

  return AgendaItem;
};
