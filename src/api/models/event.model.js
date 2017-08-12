'use strict';

module.exports = function(sequelize, DataTypes) {

  var Model = sequelize.define('event', {

    // Setup fields
    title: DataTypes.STRING,

    description: DataTypes.TEXT,

    startdate: {
      type: DataTypes.DATE // UTC Time
    },

    enddate: {
      type: DataTypes.DATE // UTC Time
    }
  });


  // Setup associations
  Model.associate = function(models) {
    Model.hasMany(models.identifier, {
      as: 'identifiers'
    });

    // Model.belongsTo(Model, {
    //   foreignKey: 'parent_id',
    //   as: 'parent'
    // });

    // Model.belongsTo(models.organization, {
    //   foreignKey: 'organization_id',
    //   as: 'organization'
    // });

    // Model.hasOne(models.agenda, {
    //   as: 'agenda'
    // });
  };

  Model.hook('afterCreate', function(event, options) {
    // sequelize.models.agenda.create({ event_id: event.id}).then(function(result){
    //   logger.info('Agenda created. ');
    // }).catch(function(error){
    //   logger.info(error);
    // });
  });

  return Model;
};
