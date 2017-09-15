const Game = require('../models/game');
const Player = require('../models/player');
const startGame = require('./start-game');
const webSocket = require('../websocket');

module.exports = (name) => {
  return Game.getStatus()
  .then((value) => {
    // Check status.
    if (value === Game.GAME_STATUS_ON) return Promise.reject('Game on.');
    return Promise.resolve();
  })
  .then(() => {
    return Player.add(name)
  }, (reason) => {
    console.log(reason);
  })
  .then(() => {
    return Player.getAll()
  }, (reason) => {
    console.log(reason);
    return Promise.reject();
  })
  .then((value) => {
    webSocket.get().emit('update playerlist');
    if (value.length === 3) startGame();
    return Promise.resolve();
  }, () => {

  })
}
