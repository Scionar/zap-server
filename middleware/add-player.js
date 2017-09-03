const Game = require('../models/game');
const Player = require('../models/player');
const startGame = require('./start-game');
const webSocket = require('../websocket');

module.exports = function (name, cb) {
  let players;

  return Promise.all([
    Game.getStatus(),
    Player.getAll()
  ])
  .then((values) => {
    players = values[1];
    // Check status.
    if (values[0] === Game.GAME_STATUS_ON) return Promise.reject('Game on.');
    return Promise.resolve();
  })
  .then(() => {
    return Player.add(name)
  }, (reason) => {
    console.log(reason);
  })
  .then(() => {
    webSocket.get().emit('update playerlist');
    if (players.length === 2) startGame();
    return Promise.resolve();
  }, (reason) => {
    console.log(reason);
  });
}
