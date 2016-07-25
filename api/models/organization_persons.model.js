'use strict';

module.exports = function(sequelize, DataTypes) {

  /**
   *
   * Schema definition
   *
   */
  var organisation_persons = sequelize.define('organization_persons', {

    role: {
      type: DataTypes.STRING
    }
  });

  return organisation_persons;
};
