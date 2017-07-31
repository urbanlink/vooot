'use strict';

module.exports = function(sequelize, DataTypes) {

  var AgendaItem = sequelize.define('agendaitem', {

    order: {
      type: DataTypes.INTEGER
    },
    type: {
      type: DataTypes.STRING
    },
    prefix: {
      type: DataTypes.STRING
    },
    title: {
      type: DataTypes.STRING
    }

  }, {
    classMethods: {
      associate: function(models) {
        // Items belong to an agenda
        AgendaItem.belongsTo(models.agenda, {
          foreignKey: 'agenda_id',
          as: 'agenda'
        });

        // Can have multpple identifiers
        AgendaItem.hasMany(models.identifier, {
          as: 'identifiers'
        });

        // Can have multiple files
        AgendaItem.belongsToMany(models.file, {
          through: 'file_agendaitem',
          foreignKey: 'agendaitem_id',
          otherKey: 'file_id',
          as: 'files'
        });
      }
    }
  });

  return AgendaItem;
};
