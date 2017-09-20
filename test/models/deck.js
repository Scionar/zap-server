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
    db.flush(() => done());
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
          data.cards.forEach((card) => {
            assert.notStrictEqual(collection.indexOf(card), -1);
          });
          done();
        },
        () => assert.fail('Create deck promise rejected.')
      )
      .catch((error) => {
        assert.fail(error);
      })
    });
  });

  describe('#collectionExists()', () => {
    it('should resolve promise if collection exists in index', (done) => {
      Deck.createDeck(data.cards)
      .then(
        () => Deck.collectionExists('default'),
        () => Promise.reject('Create deck failed.')
      )
      .then(
        () => done(),
        (msg) => {
          const message = msg ? msg : 'collectionExists failed.';
          assert.fail(message);
          done();
        }
      )
      .catch((error) => {
        assert.fail(error);
      })
    });

    it("should reject promise if collection doesn't exists in index", (done) => {
      Deck.createDeck(data.cards)
      .then(
        () => Deck.collectionExists('wrongCollection'),
        () => Promise.reject('Create deck failed.')
      )
      .then(
        () => {
          assert.fail("Collection shouldn't resolve.");
          done();
        },
        (msg) => {
          const message = msg ? msg : 'collectionExists failed.';
          done();
        }
      )
      .catch((error) => {
        assert.fail(error);
      })
    });
  });

  describe('#createCollection()', () => {
    it('should create a new collection', (done) => {
      Deck.createDeck(data.cards)
      .then(
        () => Deck.createCollection('test'),
        () => {throw new Error('Create deck failed.')}
      )
      .then(
        () => db.get().lrangeAsync('deck:index', 0, -1),
        () => {throw new Error('Create collection failed.')}
      )
      .then(
        (dbValue) => {
          const index = dbValue;
          assert.strictEqual(index.length, 2);
          assert.notStrictEqual(index.indexOf('default'), -1);
          assert.notStrictEqual(index.indexOf('test'), -1);
          done();
        },
        () => {throw new Error('Getting database values failed.')}
      )
      .catch((error) => {
        assert.fail(error);
      });
    });
  });

  describe('#removeCollection', () => {
    it('should remove collection from index and collection', (done) => {
      Deck.createDeck(data.cards)
      .then(
        () => Deck.createCollection('test'),
        () => {throw new Error('Create deck failed.')}
      )
      .then(
        () => Deck.swapCard(data.cards[0], 'default', 'test'),
        () => {throw new Error('Create new collection failed.')}
      )
      .then(
        () => Deck.removeCollection('test'),
        () => {}
      )
      .then(
        () => Promise.all([
          db.get().lrangeAsync('deck:index', 0, -1),
          db.get().lrangeAsync('deck:collection:test', 0, -1)
        ]),
        () => {throw new Error('Swap card between collections failed.')}
      )
      .then(
        (dbValues) => {
          const index = dbValues[0];
          assert.strictEqual(index.indexOf('test'), -1);

          const collection = dbValues[1];
          assert.strictEqual(collection.length, 0);
          done();
        },
        () => {throw new Error('Fetching database data failed.')}
      )
      .catch((error) => {
        assert.fail(error);
      });
    });
  });
});
