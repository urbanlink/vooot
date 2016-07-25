'use strict';

module.exports = function(sequelize, DataTypes) {

  var Link = sequelize.define('link', {
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    note: {
      type: DataTypes.TEXT
    }
  }, {
    classMethods: {
      associate: function(models) {
        Link.belongsTo(models.organization, {
          foreignKey: 'organization_id',
          as: 'organization'
        });
      }
    }
  });

  return Link;
};
