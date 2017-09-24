const assert = require('assert');
const db = require('../../db');
const Deck = require('../../models/deck');
const Player = require('../../models/player');
const dealCards = require('../../middleware/deal-cards');
const gameData = require('../../data');

describe('deal-cards middleware', () => {
  before(function (done) {
    db.connect((err) => {
      if (err) return done(err);
      done();
    });
  });

  beforeEach(function (done) {
    db.flush(() => {
      Deck.createDeck(gameData.initCards)
      .then(
        () => Promise.all([
          Player.add('Test1'),
          Player.add('Test2'),
          Player.add('Test3'),
          Deck.createCollection('Test1'),
          Deck.createCollection('Test2'),
          Deck.createCollection('Test3')
        ]),
        () => {}
      )
      .then(
        () => done(),
        () => {}
      )

    });
  });

  it('should deal cards for players', function (done) {
    dealCards()
    .then(
      () => done(),
      () => console.log('LOL')
    )
  });
});
