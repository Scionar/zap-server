const Game = require('../models/game');
const webSocket = require('../websocket');

module.exports = function () {
  Game.setStatus(Game.GAME_STATUS_ON)
  .then(() => {
    console.log('Game started!');
    webSocket.get().emit('start game');
  });
}
