const expect = require('chai').should();
const db = require('../../db');
const Player = require('../../models/player');
const data = require('../data/player');

describe('Player model', () => {
  before(function (done) {
    db.connect((err) => {
      if (err) return done(err);
      done();
    });
  });

  beforeEach(function (done) {
    db.flush(() => {
      db.input(data.collections, () => {
        done();
      });
    });
  });

  describe('#getAll()', function () {
    it('should return array with two users objects', function (done) {
      Player.getAll()
      .then((value) => {
        value.should.be.a('array');
        value.should.have.lengthOf(2);
        value[0].should.be.a('object');
        value[1].should.be.a('object');
        done();
      });
    });
  });

  describe('#deleteAll()', function () {
    it('remove all users', function (done) {
      Player.deleteAll()
      .then(() => {
        return Player.getAll()
      })
      .then((value) => {
        value.should.have.lengthOf(0);
        done();
      });
    });
  });

  describe('#add()', function () {
    it('should add one new user', function (done) {
      Player.add('Test')
      .then(() => {
        return Player.getAll();
      }).then((value) => {
        value.should.be.a('array');
        value.should.have.lengthOf(3);
        value.should.deep.include({name: 'test1'});
        value.should.deep.include({name: 'test2'});
        value.should.deep.include({name: 'Test'});
        done();
      });
    });

    it('should add one new user as a first', function (done) {
      Player.deleteAll()
      .then(() => {
        return Player.add('Test');
      })
      .then(() => {
        return Player.getAll();
      })
      .then((value) => {
        value.should.be.a('array');
        value.should.have.lengthOf(1);
        value.should.deep.include({name: 'Test'});
        done();
      });
    });
  });

  describe('#delete()', function () {
    it('should delete test1 and only have test2 user anymore', function (done) {
      Player.delete('test1')
      .then(() => {
        return Player.getAll();
      })
      .then((value) => {
        value.should.have.lengthOf(1);
        value.should.deep.include({name: 'test2'});
        value.should.not.deep.include({name: 'test1'});
        done();
      });
    });
  });
});
