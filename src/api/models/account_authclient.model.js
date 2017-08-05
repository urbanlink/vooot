'use strict';

module.exports = function(sequelize, DataTypes) {

  var Model = sequelize.define('account_authclient', {

    refreshtoken: {
      type: DataTypes.STRING
    }
  });

  return Model;
};
