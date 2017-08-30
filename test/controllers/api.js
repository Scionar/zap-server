const expect = require('chai').should();
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
        const value = res.body;
        value.should.be.a('object');
        value.should.have.property('players');
        value.players.should.be.a('array');
        value.players.should.have.lengthOf(2);
        value.players[0].should.have.property('name');
        value.players[0].name.should.equal('test1');
        value.players[1].should.have.property('name');
        value.players[1].name.should.equal('test2');
        done();
      });
    });
  });
});
