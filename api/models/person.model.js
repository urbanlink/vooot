'use strict';

module.exports = function(sequelize, DataTypes) {

  var Person = sequelize.define('person', {

    name: {
      type: DataTypes.STRING,
      required: true,
    },

    gender: {
      type: DataTypes.STRING
    },

    image: {
      type: DataTypes.STRING,
    },

    biography: {
      type: DataTypes.TEXT,
    }
  }, {
    classMethods: {
      associate: function(models) {
        Person.hasMany(models.identifier, {
          as: 'identifiers'
        });

        Person.belongsToMany(models.organization, {
          as: 'memberships',
          through: 'membership'
        });
      }
    }
  });

  return Person;
};
