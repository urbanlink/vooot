'use strict';

module.exports = function(sequelize, DataTypes) {

  var Model = sequelize.define('person_othername_type', {

    value: {
      type: DataTypes.STRING,
      required: true
    }
  }, {
    timestamps: false
  });

  return Model;
};
