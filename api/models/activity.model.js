'use strict';

module.exports = function(sequelize, DataTypes) {

  var Activity = sequelize.define('activity', {

    message: {
      type: DataTypes.TEXT
    },
    data: {
      type: DataTypes.TEXT
    }

  }, {
    classMethods: {
      associate: function(models) {
        console.log(models);
        Activity.belongsTo(models.person);
      }
    }
  });

  return Activity;
};
