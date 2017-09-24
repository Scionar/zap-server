const db = require('../db');
const Game = require('../models/game');
const Player = require('../models/player');

module.exports = () => {
  return Game.setStatus(Game.GAME_STATUS_OFF)
  .then(() => {
    return Player.deleteAll();
  }, (error) => {
    console.error(error);
  })
}
