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
      type: DataTypes.BOOLEAN
    },
    startdate: {
      type: DataTypes.STRING
    },
    enddate: {
      type: DataTypes.STRING
    }
  });

  return Model;
};
