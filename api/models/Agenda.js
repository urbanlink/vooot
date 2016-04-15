'use strict';

module.exports = function(sequelize, DataTypes) {

  var Agenda = sequelize.define('Agenda', {


  }, {
    classMethods: {
      associate: function(models) {

        Agenda.hasMany(models.AgendaItem, {
          as: 'items'
        });
      }
    }
  });

  return Agenda;
};
