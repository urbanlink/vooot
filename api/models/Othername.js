'use strict';

module.exports = function(sequelize, DataTypes) {

  var Othername = sequelize.define('Othername', {

    name: {
      type: DataTypes.STRING,
      required: true,
    },
    note: {
      type: DataTypes.STRING,
    },
    start_date: {
      type: DataTypes.DATE,
    },
    end_date: {
      type: DataTypes.DATE
    }
  }, {
    classMethods: {
      associate: function(models) {
        Othername.belongsTo(models.Organization, {
          foreignKey: 'organization_id',
          as: 'organization'
        });
      }
    }
  });

  return Othername;
};
