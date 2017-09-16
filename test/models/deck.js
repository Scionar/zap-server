const assert = require('assert');
const db = require('../../db');
const Deck = require('../../models/deck');
const data = require('../data/deck');

describe('Deck model', () => {
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

  describe('#createDeck()', () => {
    it('should create collection index and default collection with cards', function (done) {
      const cardAmount = data.cards.length;

      Deck.createDeck(data.cards)
      .then(
        () => Promise.all([
          db.get().lrangeAsync('deck:index', 0, -1),
          db.get().lrangeAsync('deck:collection:default', 0, -1)
        ]),
        () => assert.fail('Create deck promise rejected.')
      )
      .then(
        (dbValues) => {
          const index = dbValues[0];
          assert.equal(Array.isArray(index), true);
          assert.deepStrictEqual(index, ['default']);

          const collection = dbValues[1];
          assert.equal(Array.isArray(collection), true);
          assert.strictEqual(collection.length, cardAmount);
          assert.notStrictEqual(collection.indexOf('h1'), -1);
          assert.notStrictEqual(collection.indexOf('h2'), -1);
          assert.notStrictEqual(collection.indexOf('h3'), -1);
          assert.notStrictEqual(collection.indexOf('h4'), -1);
          done();
        },
        () => assert.fail('Create deck promise rejected.')
      );
    });
  });
});
