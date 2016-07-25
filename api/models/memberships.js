'use strict';

module.exports = function(sequelize, DataTypes) {

  /**
   *
   * Schema definition
   *
   */
  var Membership = sequelize.define('membership', {

    role: {
      type: DataTypes.STRING
    }
  });

  return Membership;
};
