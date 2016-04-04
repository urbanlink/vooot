'use strict';

module.exports = function(sequelize, DataTypes) {

  var Link = sequelize.define('Link', {
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
        Link.belongsTo(models.Organization, {
          foreignKey: 'organization_id',
          as: 'organization'
        });
      }
    }
  });

  return Link;
};
