const Game = require('../models/game');
const Player = require('../models/player');
const startGame = require('./start-game');

module.exports = function (name, socket, cb) {
  // Check if game has not started yet.
  Game.setStatus((status) => {
    if (status === Game.GAME_STATUS_OFF) {
      // Check that there is still space for new player.
      Player.getAll((players) => {
        if (players.length < 3) {
          Player.add(name, () => {
            socket.emit('update playerlist');
            if (players.length === 2) startGame(socket);
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
