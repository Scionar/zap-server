const expect = require('chai').should();
const db = require('../../db');
const Game = require('../../models/game');
const data = require('../data/game');

describe('Game model', () => {
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

  describe('constants', function () {
    it('should have ON constant', function (done) {
      Game.should.have.property('GAME_STATUS_ON');
      done();
    });

    it('should have OFF constant', function (done) {
      Game.should.have.property('GAME_STATUS_OFF');
      done();
    });
  });

  describe('#getStatus()', function () {
    it('should return right value', function (done) {
      Game.getStatus()
      .then((value) => {
        value.should.be.a('string');
        value.should.equal(Game.GAME_STATUS_OFF);
        done();
      });
    });
  });

  describe('#setStatus', function () {
    it('should change game status to ON', function (done) {
      Game.setStatus(Game.GAME_STATUS_ON)
      .then(() => {
        return Game.getStatus()
      })
      .then((value) => {
        value.should.equal(Game.GAME_STATUS_ON);
        done();
      });
    });

    it('should change game status to OFF', function (done) {
      Game.setStatus(Game.GAME_STATUS_OFF)
      .then(() => {
        return Game.getStatus()
      })
      .then((value) => {
        value.should.equal(Game.GAME_STATUS_OFF);
        done();
      });
    });
  });

});
