'use strict';

module.exports = function(sequelize, DataTypes) {

  var Model = sequelize.define('identifier', {

    value: {
      type: DataTypes.STRING,
      required: true
    }
  });

  Model.associate = function(models) {
    Model.belongsTo(models.identifier_type, {
      as: 'type'
    });
  };

  return Model;
};
