'use strict';

module.exports = function(sequelize, DataTypes) {

  var Model = sequelize.define('account_authclient', {

    refreshtoken: {
      type: DataTypes.STRING
    }
  });

  Model.associate = function(models) {

    // account logged in clients
    Model.belongsTo(models.account, {
      as:'account'
    });
  };


  return Model;
};
