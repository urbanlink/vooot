'use strict';

module.exports = function(sequelize, DataTypes) {

  var Model = sequelize.define('organization_classification', {

    value: {
      type: DataTypes.STRING
    },

    name: {
      type: DataTypes.STRING,
    },

    description: {
      type: DataTypes.TEXT
    }
  }, {
    timestamps: false
  });

  return Model;
};
