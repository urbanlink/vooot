'use strict';

module.exports = function(sequelize, DataTypes) {

  /**
   *
   * Schema definition
   *
   */
  var Model = sequelize.define('membership', {

    label: {
      type: DataTypes.STRING
    },

    startdate: {
      type: DataTypes.DATE
    },

    enddate: {
      type: DataTypes.DATE
    }
  });

  // Setup associations
  Model.associate = function(models) {

    Model.belongsTo(models.person, {
      as: 'person'
    });

    Model.belongsTo(models.organization, {
      as: 'organization'
    });

    Model.belongsTo(models.membership_role, {
      as: 'role'
    });

  };

  return Model;
};
