const Player = require('../models/player');
const Game = require('../models/game');
const Deck = require('../models/deck');
const webSocket = require('../websocket');

module.exports = name => {
  let gameStatus = null;
  return Player.delete(name)
  .then(
    () => Game.getStatus(),
    error => error
  )
  .then(
    status => {
      gameStatus = status;
      if (gameStatus === Game.GAME_STATUS_ON) return Deck.swapCollection(name, 'default');
      return Promise.resolve();
    },
    error => error
  )
  .then(
    () => {
      webSocket.get().emit('update playerlist');
      if (gameStatus === Game.GAME_STATUS_ON) return Deck.removeCollection(name);
    },
    error => error
  )
  .catch(error => {console.log(error);});
}
