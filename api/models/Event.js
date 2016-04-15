'use strict';

module.exports = function(sequelize, DataTypes) {

  var Event = sequelize.define('Event', {

    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    name: DataTypes.STRING,

    description: DataTypes.TEXT,

    start_date: DataTypes.DATE,

    end_date: DataTypes.DATE,

    location: DataTypes.STRING,

    status: DataTypes.STRING,

    classification: DataTypes.STRING,

    attendees: DataTypes.STRING,

    // voOot fields
    last_sync_date: DataTypes.DATE

  }, {
    classMethods: {
      associate: function(models) {
        Event.belongsTo(Event, {
          foreignKey: 'parent_id',
          as: 'parent'
        });

        Event.belongsTo(models.Organization, {
          foreignKey: 'organization_id',
          as: 'organization'
        });

        Event.hasMany(models.Identifier, {
          as: 'identifiers'
        });

        Event.hasOne(models.Agenda, {
          as: 'agenda'
        });
      }
    }
  });

  Event.hook('afterCreate', function(event, options) {
    console.log(sequelize.models.Agenda);
    console.log('model created + ' + event.id);
    sequelize.models.Agenda.create({ event_id: event.id}).then(function(result){
      console.log('Agenda created. ');
    }).catch(function(error){
      console.log(error);
    });
  });

  return Event;
};
