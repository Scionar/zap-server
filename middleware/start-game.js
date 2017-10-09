const Game = require('../models/game');
const Deck = require('../models/deck');
const webSocket = require('../websocket');
const data = require('../data');
const dealCards = require('./deal-cards');
const createPlayerCollections = require('./create-player-collections');

module.exports = () => Game.setStatus(Game.GAME_STATUS_ON)
  .then(
    () => {
      webSocket.get().emit('start game');
      return Promise.resolve();
    },
    () => new Error('Getting game status failed!'),
  )
  .catch(error => console.log(error))
  .then(
    () => Deck.createDeck(data.initCards),
    () => new Error('Emitting game start failed!'),
  )
  .then(
    () => Deck.createCollection('table'),
    () => new Error('Creating deck failed!'),
  )
  .then(
    () => createPlayerCollections(),
    () => new Error('Creating table collection failed!'),
  )
  .catch(error => console.log(error))
  .then(
    () => dealCards(5),
    () => new Error('Creating player collections failed!'),
  )
  .catch(error => console.log(error))
  .then(
    () => { webSocket.get().emit('cards dealed'); },
    () => new Error('Dealing cards failed!'),
  )
  .catch(error => console.log(error));
