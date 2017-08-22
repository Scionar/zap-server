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
    it('should return array with two users objects', function (done) {
      Player.getAll((value) => {
        value.should.be.a('array');
        value.should.have.lengthOf(2);
        value[0].should.be.a('object');
        value[1].should.be.a('object');
        done();
      });
    });
  });

  describe('#deleteAll', function () {
    it('remove all users', function (done) {
      Player.deleteAll(() => {
        Player.getAll((value) => {
          value.should.have.lengthOf(0);
          done();
        });
      });
    });
  });

  // describe('#add()', function () {
  //   it('should add one new user to end of list', function (done) {
  //     Player.add('Test', () => {
  //       Player.getAll((value) => {
  //         value.should.be.a('array');
  //         value.should.have.lengthOf(2);
  //         value[1].should.be.a('string');
  //         value[1].should.equal('Test');
  //         done();
  //       });
  //     });
  //   });
  //
  //   it('should add one new user to empty list', function (done) {
  //     Player.deleteAll(() => {
  //       Player.add('Test', () => {
  //         Player.getAll((value) => {
  //           value.should.be.a('array');
  //           value.should.have.lengthOf(1);
  //           value[0].should.be.a('string');
  //           value[0].should.equal('Test');
  //           done();
  //         });
  //       });
  //     });
  //   });
  // });

});
