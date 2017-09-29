const socketIO = require('socket.io');

const state = {
  webSocket: null,
};

module.exports.create = (server) => {
  state.webSocket = socketIO(server);
};

module.exports.get = () => state.webSocket;
