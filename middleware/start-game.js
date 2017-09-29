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
    () => { throw new Error('Getting game status failed!'); },
  )
  .catch(error => console.log(error))
  .then(
    () => Deck.createDeck(data.initCards),
    () => { throw new Error('Emitting game start failed!'); },
  )
  .then(
    () => createPlayerCollections(),
    () => { throw new Error('Creating deck failed!'); },
  )
  .catch(error => console.log(error))
  .then(
    () => dealCards(5),
    () => { throw new Error('Creating player collections failed!'); },
  )
  .catch(error => console.log(error))
  .then(
    () => { webSocket.get().emit('cards dealed'); },
    () => { throw new Error('Dealing cards failed!'); },
  )
  .catch(error => console.log(error));
