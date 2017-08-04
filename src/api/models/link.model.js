'use strict';

module.exports = function(sequelize, DataTypes) {

  var Model = sequelize.define('link', {

    title: {
      type: DataTypes.STRING,
    },
    value: {
      type: DataTypes.STRING,
      required: true,
    },
    description: {
      type: DataTypes.STRING,
    },
    category: {
      type: DataTypes.STRING,
    }
  });

  return Model;
};
