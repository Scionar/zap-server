const expect = require('chai').should();
const db = require('../../db');
const Player = require('../../models/player');
const data = require('../data/player');

describe('Player model', () => {
  before((done) => {
    db.connect((err) => {
      if (err) return done(err);
      done();
    });
  });

  beforeEach((done) => {
    db.flush(() => {
      db.input(data.collections, () => {
        done();
      });
    });
  });

  describe('#getAll()', () => {
    it('should return array with two users objects', (done) => {
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

  describe('#deleteAll()', () => {
    it('remove all users', (done) => {
      Player.deleteAll()
        .then(() => Player.getAll())
        .then((value) => {
          value.should.have.lengthOf(0);
          done();
        });
    });
  });

  describe('#add()', () => {
    it('should add one new user', (done) => {
      Player.add('Test')
        .then(() => Player.getAll()).then((value) => {
          value.should.be.a('array');
          value.should.have.lengthOf(3);
          value.should.deep.include({ name: 'test1' });
          value.should.deep.include({ name: 'test2' });
          value.should.deep.include({ name: 'Test' });
          done();
        });
    });

    it('should add one new user as a first', (done) => {
      Player.deleteAll()
        .then(() => Player.add('Test'))
        .then(() => Player.getAll())
        .then((value) => {
          value.should.be.a('array');
          value.should.have.lengthOf(1);
          value.should.deep.include({ name: 'Test' });
          done();
        });
    });
  });

  describe('#delete()', () => {
    it('should delete test1 and only have test2 user anymore', (done) => {
      Player.delete('test1')
        .then(() => Player.getAll())
        .then((value) => {
          value.should.have.lengthOf(1);
          value.should.deep.include({ name: 'test2' });
          value.should.not.deep.include({ name: 'test1' });
          done();
        });
    });
  });
});
