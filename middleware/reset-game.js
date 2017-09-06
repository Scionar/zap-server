const Game = require('../models/game');
const Player = require('../models/player');

module.exports = function () {
  return Game.setStatus(Game.GAME_STATUS_OFF)
  .then(() => {
    return Player.deleteAll();
  });
}
