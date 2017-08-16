const game = require('../models/game');
const startGame = require('./start-game');

module.exports = function (name, socket, cb) {
  // Check if game has not started yet.
  game.getGameStatus((status) => {
    if (status === game.GAME_STATUS_OFF) {
      // Check that there is still space for new player.
      game.getAllPlayers((players) => {
        if (players.length < 3) {
          game.addPlayer(name, () => {
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
