const Game = require('../models/game');

module.exports = function (socket) {
  Game.setStatus(Game.GAME_STATUS_ON, () => {
    console.log('Game started!');
    socket.emit('start game');
  });
}
