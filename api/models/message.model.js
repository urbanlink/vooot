'use strict';

module.exports = function(sequelize, DataTypes) {

  var Message = sequelize.define('message', {

    title: {
      type: DataTypes.STRING
    },
    msg: {
      type: DataTypes.TEXT
    }
  }, {
    classMethods: {
      associate: function(models) {

        Message.belongsTo(models.account, {
          foreignKey: 'account_id',
          as: 'sender'
        });

        Message.belongsTo(models.person, {
          foreignKey: 'person_id',
          as: 'receiver'
        });

        Message.belongsTo(Message, {
          foreignKey: 'parent_id',
          as: 'parent'
        });
      }
    }
  });

  return Message;
};
