'use strict';

module.exports = function(sequelize, DataTypes) {

  var Model = sequelize.define('account_role', {

  });


  Model.associate = function(models) {

    // role types
    Model.belongsTo(models.account_role_type, {
      as:'type',
      through: 'type_id'
    });
  };


  return Model;
};
