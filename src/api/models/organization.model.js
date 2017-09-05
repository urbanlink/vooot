'use strict';

module.exports = function(sequelize, DataTypes) {

  var Model = sequelize.define('organization', {

    name: {
      type: DataTypes.STRING
    },

    abstract: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    description: {
      type: DataTypes.TEXT
    },

    foundingdate: {
      type: DataTypes.DATE
    },

    dissolutiondate: {
      type: DataTypes.DATE
    }

  });

  // Setup associations
  Model.associate = function(models) {

    Model.belongsTo(Model, {
      foreignKey: 'parent_id',
      as: 'parent'
    });

    Model.belongsTo(models.organization_classification, {
      foreignKey: 'classification_id',
      as: 'classification'
    });

    Model.hasMany(models.identifier, {
      as: 'identifiers'
    });
  };

  return Model;
};
