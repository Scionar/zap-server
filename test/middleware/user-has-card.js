const assert = require('chai').assert;
const db = require('../../db');
const Deck = require('../../models/deck');
const Player = require('../../models/player');
const userHasCard = require('../../middleware/user-has-card');
const data = require('../data/deck');

describe('user-has-card middleware', () => {
  before((done) => {
    db.connect((err) => {
      if (err) return done(err);
      done();
    });
  });

  beforeEach((done) => {
    db.flush(() => {
      Deck.createDeck(data.cards)
        .then(
          () => Promise.all([
            Player.add('Test1'),
            Deck.createCollection('Test1'),
          ]),
          () => {},
        )
        .then(
          () => done(),
          () => {},
        );
    });
  });

  it('should return true if existing card exists', (done) => {
    let checkedCard = null;
    Deck.getCollection('default')
      .then(
        collection => Promise.resolve(collection[0]),
        () => { assert.isOk(false, 'Getting collection failed.'); },
      )
      .then(
        card => {
          checkedCard = card;
          return Deck.swapCard(checkedCard, 'default', 'Test1');
        },
        () => { assert.isOk(false, 'Getting one out of collection failed.'); }
      )
      .then(
        () => userHasCard('Test1', checkedCard),
        () => { assert.isOk(false, 'Swapping card failed.'); }
      )
      .then(
        cardExists => {
          assert.isTrue(cardExists);
          done();
        },
        () => { assert.isOk(false, 'userHasCard got rejected.'); }
      )
      .catch(() => { assert.isOk(false, 'Error got thrown.'); })
  });

  it('should return false if existing card does not exists', (done) => {
    Deck.getCollection('default')
      .then(
        collection => Promise.resolve(collection[0]),
        () => { assert.isOk(false, 'Getting collection failed.'); },
      )
      .then(
        card => {
          checkedCard = card;
          return Deck.swapCard(checkedCard, 'default', 'Test1');
        },
        () => { assert.isOk(false, 'Getting one out of collection failed.'); }
      )
      .then(
        () => userHasCard('Test1', 'thisCardIdDoesNotExist'),
        () => { assert.isOk(false, 'Swapping card failed.'); }
      )
      .then(
        cardExists => {
          assert.isFalse(cardExists);
          done();
        },
        () => { assert.isOk(false, 'userHasCard got rejected.'); }
      )
      .catch(() => { assert.isOk(false, 'Error got thrown.'); })
  });

  it('should return false if target collection is empty', (done) => {
    userHasCard('Test1', 'thisCardIdDoesNotExist')
      .then(
        cardExists => {
          assert.isFalse(cardExists);
          done();
        },
        () => { assert.isOk(false, 'userHasCard got rejected.'); }
      )
      .catch(() => { assert.isOk(false, 'Error got thrown.'); })
  });
});
