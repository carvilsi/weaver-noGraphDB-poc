var request = require('supertest');
var assert = require('assert');

describe('EntityController', function() {

  describe('#create()', function() {
    it('should creates an entity', function (done) {
      request(sails.hooks.http.app)
        .post('/entity/create')
        .send({ id: 'Cypher' })
        .end(function (err, result) {
          assert.equal(result.body.idw, 'Cypher');
          done();
        });
    });
    it('should creates an entity with attributes', function (done) {
      request(sails.hooks.http.app)
        .post('/entity/create')
        .send({ id: 'Neo', key: 'Name', value: 'Mr Anderson' })
        .end(function (err, result) {
          assert.equal(result.body.idw, 'Neo');
          assert.equal(result.body.attributes[0].value, 'Mr Anderson');
          done();
        });
    });
    it('should fail on creates an entity with attributes', function (done) {
      request(sails.hooks.http.app)
        .post('/entity/create')
        .send({ id: 'Neo', key: 'Name', value: 'Mr Anderson' })
        .expect(400, done);
    });
  });

  describe('#update()', function() {
    it('should updates an entity', function (done) {
      request(sails.hooks.http.app)
        .post('/entity/update')
        .send({ id: 'Neo', key: 'Phone', value: '5555' })
        .expect(200, done);
    });
  });

  describe('#create()', function() {
    it('should creates another entity', function (done) {
      request(sails.hooks.http.app)
        .post('/entity/create')
        .send({ id: 'Smith', key: 'Name', value: 'Agent Smith' })
        .expect(200, done);
    });
  });

  describe('#delte()', function() {
    it('should deltes an entity', function (done) {
      request(sails.hooks.http.app)
        .post('/entity/delete')
        .send({ id: 'Smith' })
        .expect(200, done);
    });
  });

  describe('#create()', function() {
    it('should creates another entity', function (done) {
      request(sails.hooks.http.app)
        .post('/entity/create')
        .send({ id: 'Trinity', key: 'Name', value: 'The Trinity' })
        .expect(200, done);
    });
  });

  describe('#relate()', function() {
    it('should relates two entities', function (done) {
      request(sails.hooks.http.app)
        .post('/entity/relate')
        .send({ source: 'Neo', target: 'Trinity', relation: 'Loves so much' })
        .end(function (err, result) {
          assert.equal(result.body.idw, 'Neo');
          assert.equal(result.body.relations[0].relation, 'Loves so much');
          done();
        });
    });
    it('should fails relates when target does not exits', function (done) {
      request(sails.hooks.http.app)
        .post('/entity/relate')
        .send({ source: 'Trinity', target: 'Architect', relation: 'hates' })
        .expect(400)
        .end(function (err, result) {
          assert.equal(result.body.msg, 'target does not exists');
          done();
        });
    });
    it('should fails relates when source does not exits', function (done) {
      request(sails.hooks.http.app)
        .post('/entity/relate')
        .send({ source: 'Architect', target: 'Trinity', relation: 'hates too' })
        .expect(400)
        .end(function (err, result) {
          assert.equal(result.body.msg, 'source does not exists');
          done();
        });
    });
  });

});
