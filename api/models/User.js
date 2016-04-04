'use strict';

module.exports = function(sequelize, DataTypes) {

  var Users = sequelize.define('Users', {

    role: DataTypes.INTEGER,

    email: DataTypes.STRING
  });

  return Users;
};
