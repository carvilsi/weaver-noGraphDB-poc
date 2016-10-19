var sails = require('sails');

before(function(done) {

  // Increase the Mocha timeout so that Sails has enough time to lift.
  this.timeout(50000);

  // sails.config.models.migrate = 'drop';

  sails.lift({


    // configuration for testing purposes

  }, function(err, server) {
    if (err) return done(err);
    // here you can load fixtures, etc.
    done(err, sails);
  });
});

after(function(done) {
  // here you can clear fixtures, etc.
  this.timeout(50000);
  sails.lower(done);
});
