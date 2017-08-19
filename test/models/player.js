const expect = require('chai').should();
const db = require('../../db');
const Player = require('../../models/Player');
const data = require('../data/player');

describe('Player model', () => {
  before((done) => {
    db.connect((err) => {
      if (err) return done(err);
      db.input(data.collections, () => {
        done();
      });
    });
  });

  beforeEach((done) => {
    db.flush(() => done());
  });

  describe('#getAll()', () => {
    it('should return one user', () => {
      Player.getAll(() => {
        values.should.be.a('array');
        values.should.have.lengthOf(1);
        values[0].should.be.a('string');
        values[0].should.equal('test1');
      });
    });
  });
});
