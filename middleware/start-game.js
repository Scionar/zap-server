const Game = require('../models/game');
const Deck = require('../models/deck');
const webSocket = require('../websocket');
const data = require('../data');


module.exports = () => {
  return Game.setStatus(Game.GAME_STATUS_ON)
  .then(() => {
    console.log('Game started!');
    webSocket.get().emit('start game');
    return Promise.resolve();
  })
  .then(() => {
    return Deck.createDeck(data.initCards);
  })
}
