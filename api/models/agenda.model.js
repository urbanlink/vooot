'use strict';

module.exports = function(sequelize, DataTypes) {

  var Agenda = sequelize.define('agenda', {


  }, {
    classMethods: {
      associate: function(models) {

        Agenda.hasMany(models.agendaitem, {
          as: 'items'
        });
      }
    }
  });

  return Agenda;
};
