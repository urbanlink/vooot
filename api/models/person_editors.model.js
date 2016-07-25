'use strict';

module.exports = function(sequelize, DataTypes) {

  /**
   *
   * Schema definition
   *
   */
  var person_editors = sequelize.define('person_editors', {

    role: {
      type: DataTypes.STRING
    }
  });

  return person_editors;
};
