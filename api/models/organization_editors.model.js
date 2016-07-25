'use strict';

module.exports = function(sequelize, DataTypes) {

  /**
   *
   * Schema definition
   *
   */
  var organisation_editors = sequelize.define('organization_editors', {

    role: {
      type: DataTypes.STRING
    }
  });

  return organisation_editors;
};
