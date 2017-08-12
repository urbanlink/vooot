'use strict';

module.exports = function(sequelize, DataTypes) {

  var Model = sequelize.define('account_role_type', {

    value: {
      type: DataTypes.STRING,
      required: true
    }
  }, {
    timestamps: false
  });

  return Model;
};
