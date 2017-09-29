const Game = require('../models/game');
const Player = require('../models/player');
const startGame = require('./start-game');
const webSocket = require('../websocket');

module.exports = name => Game.getStatus()
  .then((value) => {
    // Check status.
    if (value === Game.GAME_STATUS_ON) return Promise.reject(new Error('Game on.'));
    return Promise.resolve();
  })
  .then(() => Player.add(name), (reason) => {
    console.log(reason);
  })
  .then(() => Player.getAll(), (reason) => {
    console.log(reason);
    return Promise.reject();
  })
  .then((value) => {
    webSocket.get().emit('update playerlist');
    if (value.length === 3) startGame();
    return Promise.resolve();
  }, () => {

  });
