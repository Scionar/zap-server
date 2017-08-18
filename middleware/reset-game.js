const Game = require('../models/game');
const Player = require('../models/player');
const startGame = require('./start-game');

module.exports = function (cb) {
  Game.setStatus(Game.GAME_STATUS_OFF, () => {
    Player.deleteAll(() => cb());
  });

}
