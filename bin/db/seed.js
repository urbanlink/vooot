'use strict';

var models = require('./../../api/models');

module.exports = {
  organizations: function() {
    models.Organization.destroy({where: {}}).then(function(result) {
      console.log('Organizations deleted:', result);
      models.Event.destroy({where: {}}).then(function(result) {
        console.log('Events deleted: ', result);
        models.Identifier.destroy({where: {}}).then(function(result){
          models.Organization.bulkCreate([
            {
              name: 'Gemeente Den Haag',
              ori_provider: 'notubiz',
              ori_source: 'http://denhaag.raadsinformatie.nl/api'
            }, {
              name: 'Gemeente Rotterdam',
              ori_provider: 'notubiz',
              ori_source: 'http://rotterdam.raadsinformatie.nl/api'
            }
          ]).then(function(result){
            console.log('Organization created. ');
          });
        });
      });
    });
  }
};
