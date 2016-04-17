'use strict';

module.exports = function(sequelize, DataTypes) {

  var File = sequelize.define('File', {

    title:    { type: DataTypes.STRING },
    source:    { type: DataTypes.STRING },
    license:   { type: DataTypes.STRING },
    note:      { type: DataTypes.STRING },
    mime_type: { type: DataTypes.STRING }
  }, {
    classMethods: {
      associate: function(models) {
        File.hasMany(models.Identifier, {
          as: 'identifiers'
        });

        File.belongsToMany(models.AgendaItem, {
          through: 'file_agendaitem',
          foreignKey: 'file_id',
          otherKey: 'agendaitem_id',
          as: 'agenda_items'
        });

      }
    }
  });

  return File;
};
