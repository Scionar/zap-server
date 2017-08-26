const request = require('supertest');
const express = require('express');
const apiController = require('../../controllers/api');
const db = require('../../db');
const gameData = require('../data/game');
const playerData = require('../data/player');

describe('API controller', () => {
  const app = express();
  app.use('/api', apiController);

  before(function (done) {
    db.connect((err) => {
      if (err) return done(err);
        app.listen(3001, () => {
          done();
        });
    });
  });

  beforeEach(function (done) {
    db.flush(() => {
      db.input(gameData.collections, () => {
        db.input(playerData.collections, () => {
          done();
        });
      });
    });
  });

  describe('GET /api/player/getall', function () {
    it('200', function (done) {
      request(app)
      .get('/api/player/getall')
      .expect(200, done);
    });

    it('content type JSON', function (done) {
      request(app)
      .get('/api/player/getall')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/, done);
    });

    it('should response right data', function (done) {
      request(app)
      .get('/api/player/getall')
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.a('object');
        res.body.should.have.property('players');
        res.body.players.should.be.a('array');
        res.body.players.should.have.lengthOf(2);
        res.body.players[0].should.have.property('name');
        res.body.players[0].name.should.equal('test2');
        res.body.players[1].should.have.property('name');
        res.body.players[1].name.should.equal('test1');
        done();
      });
    });
  });


});
