'use strict';

module.exports = function(sequelize, DataTypes) {

  var Model = sequelize.define('identifier_type', {

    value: {
      type: DataTypes.STRING,
      required: true
    },
    name: {
      type: DataTypes.STRING
    },
    descripption: {
      type: DataTypes.TEXT
    }
  }, {
    timestamps: false
  });

  return Model;
};
