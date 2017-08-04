'use strict';

module.exports = function(sequelize, DataTypes) {

  var Event = sequelize.define('event', {

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

        Event.belongsTo(models.organization, {
          foreignKey: 'organization_id',
          as: 'organization'
        });

        Event.hasMany(models.identifier, {
          as: 'identifiers'
        });

        Event.hasOne(models.agenda, {
          as: 'agenda'
        });
      }
    }
  });

  Event.hook('afterCreate', function(event, options) {
    sequelize.models.agenda.create({ event_id: event.id}).then(function(result){
      logger.info('Agenda created. ');
    }).catch(function(error){
      logger.info(error);
    });
  });

  return Event;
};
