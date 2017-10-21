'use strict';

module.exports = function(sequelize, DataTypes) {

  var Model = sequelize.define('membership_role', {

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
