const Game = require('../models/game');
const Player = require('../models/player');
const startGame = require('./start-game');
const webSocket = require('../websocket');

module.exports = function (name, cb) {
  // Check if game has not started yet.
  Game.getStatus()
  .then((status) => {
    if (status === Game.GAME_STATUS_OFF) {
      // Check that there is still space for new player.
      Player.getAll()
      .then((players) => {
        if (players.length < 3) {
          Player.add(name)
          .then(() => {
            webSocket.get().emit('update playerlist');
            if (players.length === 2) startGame();
            cb('ok', '');
          });
        } else {
          cb('error', 'No more slots for more players.');
        }
      });
    } else {
      cb('error', 'Game has already started.');
    }
  });
}
