'use strict';

module.exports = function(sequelize, DataTypes) {

  var ContactDetail = sequelize.define('contactdetail', {

    label: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
      type:  DataTypes.STRING,
      allowNull: false
    },
    node: {
      type:  DataTypes.STRING,
    }
  }, {
    classMethods: {
      associate: function(models) {
        ContactDetail.belongsTo(models.organization, {
          foreignKey: 'organization_id',
          as: 'organization'
        });
      }
    }
  });

  return ContactDetail;
};
