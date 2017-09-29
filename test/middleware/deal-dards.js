const assert = require('assert');
const db = require('../../db');
const Deck = require('../../models/deck');
const Player = require('../../models/player');
const dealCards = require('../../middleware/deal-cards');
const gameData = require('../../data');

describe('deal-cards middleware', () => {
  before((done) => {
    db.connect((err) => {
      if (err) return done(err);
      done();
    });
  });

  beforeEach((done) => {
    db.flush(() => {
      Deck.createDeck(gameData.initCards)
        .then(
          () => Promise.all([
            Player.add('Test1'),
            Player.add('Test2'),
            Deck.createCollection('Test1'),
            Deck.createCollection('Test2'),
          ]),
          () => {},
        )
        .then(
          () => done(),
          () => {},
        );
    });
  });

  it('should deal cards for players', (done) => {
    dealCards(5)
      .then(
        () => Promise.all([
          Deck.getCollection('default'),
          Deck.getCollection('Test1'),
          Deck.getCollection('Test2'),
        ]),
        () => {},
      )
      .catch(error => assert.fail(error))
      .then(
        (collections) => {
          const defaultCollection = collections[0];
          const test1Collection = collections[1];
          const test2Collection = collections[2];

          // Collection lengths are right.
          assert.strictEqual(defaultCollection.length, gameData.initCards.length - (5 * 2));
          assert.strictEqual(test1Collection.length, 5);

          // Check that card should appear only once in deck.
          const result1 = test1Collection.every(current => !(defaultCollection.indexOf(current) + 1));
          if (!result1) assert.fail('Test1 collection contains same card as in default collection.');

          const result2 = test2Collection.every(current => !(defaultCollection.indexOf(current) + 1));
          if (!result2) assert.fail('Test2 collection contains same card as in default collection.');

          return Promise.resolve();
        },
        () => { throw new Error('Getting test data failed.'); },
      )
      .then(() => done())
      .catch(error => assert.fail(error));
  });
});
