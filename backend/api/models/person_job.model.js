'use strict';

module.exports = function(sequelize, DataTypes) {

  var Model = sequelize.define('person_job', {

    title: {
      type: DataTypes.STRING,
      required: true,
    },

    description: {
      type: DataTypes.TEXT
    },

    paid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    startdate: {
      type: DataTypes.DATE
    },

    enddate: {
      type: DataTypes.DATE
    }
  });

  return Model;
};
