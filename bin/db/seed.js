'use strict';

var models = require('./../../api/models');

module.exports = {
  organizations: function(cb) {
    models.Organization.destroy({where: {}}).then(function(result) {
      console.log('Organizations deleted:', result);
      models.Event.destroy({where: {}}).then(function(result) {
        console.log('Events deleted: ', result);
        models.Identifier.destroy({where: {}}).then(function(result){
          models.Organization.create({
            name: 'Gemeente Rotterdam',
            classification: 'municipality',
          }).then(function(organization) {
            console.log('Organization created: ' + organization.id);
              models.Identifier.create({
              scheme: 'notubiz',
              identifier: 'rotterdam',
              organization_id: organization.id
            }).then(function(result) {
              console.log('Identifier created: ' + result.id);
              cb();
            }).catch(function(error){
              console.log(error);
            });
          }).catch(function(error){
            console.log(error);
          });
        });
      });
    });
  }
};
