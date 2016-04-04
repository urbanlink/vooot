'use strict';

module.exports = function(sequelize, DataTypes) {

  var Image = sequelize.define('Image', {

    created:   {
      type: DataTypes.STRING,
      defaultValue: Date.now
    },
    url:       { type: DataTypes.STRING, },
    source:    { type: DataTypes.STRING, },
    license:   { type: DataTypes.STRING, },
    note:      { type: DataTypes.STRING, },
    mime_type: { type: DataTypes.STRING, },

  }, {
    classMethods: {
      associate: function(models) {
        Image.belongsTo(models.Organization, {
          foreignKey: 'organization_id',
          as: 'organization'
        });
      }
    }
  });

  return Image;
};
