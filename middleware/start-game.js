const game = require('../models/game');

module.exports = function (socket) {
  game.setGameStatus(game.GAME_STATUS_ON, () => {
    console.log('Game started!');
    socket.emit('start game');
  });
}
