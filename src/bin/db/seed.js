'use strict';

var models = require('./../../api/models');
var settings = require('./../../config/settings');
var extractor = require('./../../extractors/almanak/organizations');
var personExtractor = require('./../../extractors/almanak/persons');

function asyncLoop(iterations, func, callback) {
  var index = 0;
  var done = false;
  var loop = {
    next: function() {
      if (done) { return; }

      if (index < iterations) {
        index++;
        func(loop);
      } else {
        done = true;
        callback();
      }
    },

    iteration: function() {
      return index - 1;
    },

    break: function() {
      done = true;
      callback();
    }
  };
  loop.next();
  return loop;
}


function createParty(party, cb) {
  models.organization.find({ where: {
    name: party.name
  }}).then(function(result) {
    if (!result) {
      models.organization.create(party).then(function(result) {
        cb(result);
      }).catch(function(error){
        console.log(error);
      });
    } else {
      cb(result);
    }
  }).catch(function(error) {
    console.log(error);
  });
}

function createOrganization(organization, cb) {
  models.organization.create(organization).then(function(result) {
    models.identifier.create({
      scheme: organization.identifiers[0].scheme,
      identifier: organization.identifiers[0].identifier,
      organization_id: result.id
    }).then(function(identifier) {
      cb();
    }).catch(function(error) {
      console.log(error);
    });
  });
}

function createPerson(person, cb) {
  console.log('Creating person: ', person);
  models.person.create(person).then(function(result) {
    var newPerson = result.dataValues;
    // Add identifier
    models.identifier.create({
      scheme: person.identifiers[ 0].scheme,
      identifier: person.identifiers[ 0].identifier,
      person_id: newPerson.id
    }).then(function(identifier) {
      console.log(identifier);
      newPerson.identifiers = [];
      newPerson.identifiers.push(identifier.dataValues);
      cb(newPerson);
    }).catch(function(error) {
      console.log(error);
    });
  }).catch(function(error) {
    console.log(error);
  });
}

module.exports = {

  // Get all municipalities from almanak.overheid
  organizations: function(cb) {
    models.organization.destroy({where: {}}).then(function(result) {
      console.log('Organizations deleted. ');
      models.event.destroy({where: {}}).then(function(result) {
        console.log('Events deleted. ');
        models.identifier.destroy({where: {}}).then(function(result){
          extractor.extractMunicipalities({}, {
            json: function(result) {
              var organizations = result;
              console.log('Municipalities extracted. ');
              console.log('Do the loop');
              asyncLoop(organizations.length, function(loop) {
                createOrganization(organizations[ loop.iteration()], function(result) {
                  // Okay, for cycle could continue
                  loop.next();
                });
              }, function() {
                console.log('Loop finished!');
                cb();
              });
            }
          });
        });
      });
    });
  },

  // Get all persons from all municipalities and add membership to municipality and party
  persons: function(cb) {
    console.log('Extracting persons. ');
    // Fetch all municipalities from the database.
    models.organization.findAll({
      where: {
        classification: 'municipality'
      },
      include: [{
        model: models.identifier,
        as: 'identifiers',
        attributes: ['scheme', 'identifier'],
        where: {
          scheme: 'almanak'
        }
      }]
    }).then(function(result) {
      console.log(result.length + ' organizations retrieved.');
      // Placeholder for the list of all persons.
      var persons = [];
      // Fetch all persons from almanak per municipality
      console.log('starting the loop');
      asyncLoop(result.length, function(loop) {
        var source =  'https://almanak.overheid.nl' + result[ loop.iteration()].identifiers[0].identifier;
        var organizationId = result[ loop.iteration()].id;
        console.log('Organization id: ' + organizationId);

        // Get the persons from the municipality.
        personExtractor.extractPersons({ query: { source: source}}, {
          json: function(result) {
            console.log('Number of persons received: ' + result.length);
            // Add to the total persons array
            persons = persons.concat(result);

            // add persons and identifiers.
            asyncLoop(result.length, function(loop2) {
              var person = result[ loop2.iteration()];
              console.log('Result person: ', person);

              createPerson(person, function(newPerson) {
                console.log('Person create result: ', newPerson);
                // Create Party if not exists
                var party = {
                  classification: 'party',
                  name: person.memberships[ 1].party
                };
                console.log('Creating party: ', party);
                createParty(party, function(result){
                  console.log('Creating party result: ', result);
                  console.log(models.membership);
                  console.log(newPerson);
                  // Create membership for the party for the person
                  models.membership.create({
                    person_id: newPerson.id,
                    organization_id: result.dataValues.id,
                    role: 'member'
                  }).then(function(result) {
                    console.log(result);
                    models.membership.create({
                      person_id: newPerson.id,
                      organization_id: organizationId,
                      role: 'council member'
                    }).then(function(result) {
                      loop2.next();
                    }).catch(function(error) {
                      console.log(error);
                    });
                  });
                });
              });
            }, function() {
              loop.next();
            });
          }
        });
      }, function() {
        console.log('get persons list complete');
        console.log(persons.length);
        console.log(persons[ 0]);
        cb();
      });
    }).catch(function(error) {
      console.log(error);
    });
  }




  // organizations: function(cb) {
  //   models.organization.destroy({where: {}}).then(function(result) {
  //     console.log('Organizations deleted. ');
  //     models.event.destroy({where: {}}).then(function(result) {
  //       console.log('Events deleted. ');
  //       models.identifier.destroy({where: {}}).then(function(result){
  //         models.organization.create({
  //           name: 'Gemeente Den Haag',
  //           classification: 'municipality',
  //         }).then(function(organization) {
  //             models.identifier.create({
  //             scheme: 'notubiz',
  //             identifier: 'denhaag',
  //             organization_id: organization.id
  //           }).then(function(result) {
  //             console.log('Identifier created: ' + result.id);
  //             // Create persons
  //             models.person.bulkCreate([
  //               {
  //                 name: 'Johan Eenhoorn',
  //                 function: 'Raadslid Gemeenteraad Den Haag',
  //                 party: 'Haagse Stedeljke Partij (HSP)',
  //                 period: '2014-2018',
  //                 image: '/assets/images/persons/headshot.jpg'
  //               },
  //               {
  //                 name: 'Arend Kapitein',
  //                 function: 'Raadslid Den Haag',
  //                 party: 'Groenlinks (GL)',
  //                 period: '2014-2018',
  //                 image: '/assets/images/persons/headshot2.jpg'
  //               },
  //               {
  //                 name: 'Anja van de Plein',
  //                 function: 'Raadslid',
  //                 period: '2014-2018',
  //                 image: '/assets/images/persons/headshot3.jpg'
  //               }
  //             ]).then(function(result) {
  //               cb();
  //             }).catch(function(error) {
  //               console.log(error);
  //             });
  //           }).catch(function(error){
  //             console.log(error);
  //           });
  //         }).catch(function(error){
  //           console.log(error);
  //         });
  //       });
  //     });
  //   });
  // }
};
