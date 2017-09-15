const Player = require('../models/player');
const webSocket = require('../websocket');

module.exports = (name) => {
  return Player.delete(name)
  .then(() => {
    webSocket.get().emit('update playerlist');
    return Promise.resolve();
  }, (error) => {
    console.log(error);
  })
}
