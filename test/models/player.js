const expect = require('chai').should();
const db = require('../../db');
const Player = require('../../models/Player');
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
    it('should return one user', function (done) {
      Player.getAll((value) => {
        value.should.be.a('array');
        value.should.have.lengthOf(1);
        value[0].should.be.a('string');
        value[0].should.equal('test1');
        done();
      });
    });
  });
});
