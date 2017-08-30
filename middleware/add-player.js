const Game = require('../models/game');
const Player = require('../models/player');
const startGame = require('./start-game');
const webSocket = require('../websocket');

module.exports = function (name, cb) {
  // Check if game has not started yet.
  Game.getStatus()
  .then((status) => {
    if (status === Game.GAME_STATUS_OFF) {
      Player.getAll()
      .then((players) => {
        let status = 'ok';
        let message = '';

        // Check that username is not taken.
        players.forEach((item) => {
          if (item.name === name) {status = 'error'; message = 'Username already in use.';}
        });

        // Check that there is still space for new player.
        if (players.length >= 3)  {status = 'error'; message = 'No more slots for new players.';}

        // If status ok, add user and start game if room full.
        if (status === 'ok') {
          Player.add(name)
          .then(() => {
            webSocket.get().emit('update playerlist');
            if (players.length === 2) startGame();
            cb(status, message);
          });
        } else {
          cb(status, message);
        }
      });
    } else {
      cb('error', 'Game has already started.');
    }
  });
}
