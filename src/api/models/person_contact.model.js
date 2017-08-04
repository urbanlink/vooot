'use strict';

module.exports = function(sequelize, DataTypes) {

  var Model = sequelize.define('person_contact', {

    value: {
      type: DataTypes.STRING,
      required: true,
    }
  });

  // Setup associations
  Model.associate = function(models) {
    Model.belongsTo(models.person_contact_type, {
      as: 'type'
    });
  };


  return Model;
};
