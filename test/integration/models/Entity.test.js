describe('EntityModel', function() {

  describe('#create()', function() {
    it('should check create function', function (done) {
      Entity.create({
        idw:'One'
      })
      .then(function(results) {
        console.log(results);
        done();
      })
      .catch(done);
    });
  });

  describe('#find()', function() {
    it('should check find function', function (done) {
      Entity.find()
      .then(function(results) {
        console.log(results);
        done();
      })
      .catch(done);
    });
  });

  describe('#update()', function() {
    it('should check update function', function (done) {
      Entity.findOne({
        idw:'One'
      })
      .then(function(result) {
        console.log(result);
        result.idw = 'Two';
        result.save(done);
      })
      .catch(done);
    });
  });

  describe('#delete()', function() {
    it('should check delete function', function (done) {
      Entity.destroy({
        idw:'Two'
      })
      .then(function(results) {
        console.log(results);
        done();
      })
      .catch(done);
    });
  });


});
