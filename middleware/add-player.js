const Game = require('../models/game');
const Player = require('../models/player');
const startGame = require('./start-game');
const webSocket = require('../websocket');

module.exports = function (name, cb) {
  // Check if game has not started yet.
  Game.getStatus()
  .then((status) => {
    if (status === Game.GAME_STATUS_OFF) {
      // Get user amount to check if room full.
      Player.getAll()
      .then((players) => {

        Player.add(name)
        .then((value) => {
          if (value === 'OK') {
            webSocket.get().emit('update playerlist');
            if (players.length === 2) startGame();
            cb('ok', '');
          }
          else if (value === 'EXISTS') {
            cb('error', 'Username already exists.');
          } else {
            cb('error', 'Undefined error.');
          }
        })
        .catch(() => {
          console.log('User was not created.');
        });

      });
    } else {
      cb('error', 'Game has already started.');
    }
  });
}
