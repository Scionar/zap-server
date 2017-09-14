const db = require('../db');
const Game = require('../models/game');
const Player = require('../models/player');

module.exports = function () {
  return Game.setStatus(Game.GAME_STATUS_OFF)
  .then(() => {
    return Player.deleteAll();
  }, (error) => {
    console.error(error);
  })
  .then(() => {
    // Remove all sessions. Done straight trough db instance because session
    // store had issues.
    return db.get().scanAsync(0, 'match', 'sess:*').then((scanValue) => {
      return Promise.all(
        scanValue[1].map((key, index, array) => {return db.get().delAsync(key)})
      )
    })
  }, (error) => {
    console.error(error);
  });
}
