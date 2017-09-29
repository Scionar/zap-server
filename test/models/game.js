const db = require('../../db');
const Game = require('../../models/game');
const data = require('../data/game');

describe('Game model', () => {
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

  describe('constants', () => {
    it('should have ON constant', (done) => {
      Game.should.have.property('GAME_STATUS_ON');
      done();
    });

    it('should have OFF constant', (done) => {
      Game.should.have.property('GAME_STATUS_OFF');
      done();
    });
  });

  describe('#getStatus()', () => {
    it('should return right value', (done) => {
      Game.getStatus()
        .then((value) => {
          value.should.be.a('string');
          value.should.equal(Game.GAME_STATUS_OFF);
          done();
        });
    });
  });

  describe('#setStatus()', () => {
    it('should change game status to ON', (done) => {
      Game.setStatus(Game.GAME_STATUS_ON)
        .then(() => Game.getStatus())
        .then((value) => {
          value.should.equal(Game.GAME_STATUS_ON);
          done();
        });
    });

    it('should change game status to OFF', (done) => {
      Game.setStatus(Game.GAME_STATUS_OFF)
        .then(() => Game.getStatus())
        .then((value) => {
          value.should.equal(Game.GAME_STATUS_OFF);
          done();
        });
    });
  });
});
