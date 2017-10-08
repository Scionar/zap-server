const socketIO = require('socket.io');
const addPlayer = require('./middleware/add-player');
const deletePlayer = require('./middleware/delete-player');
const userHasCard = require('./middleware/user-has-card');
const Deck = require('./models/deck');

const state = {
  webSocket: null,
};

module.exports.create = (server) => {
  const webSocket = socketIO(server);

  webSocket.on('connection', (socket) => {
    // Initialize socket.
    if (!socket.data) socket.data = { name: null };

    socket.on('add player', (data, fn) => {
      addPlayer(data.name)
        .then(
          () => {
            // Add user data to socket.
            socket.data.name = data.name;
            fn({ status: 'ok' });
          },
          () => fn({ status: 'error' }),
        );
    });

    socket.on('throw card', (data, fn) => {
      console.log(data.cardId);
      userHasCard(socket.data.name, data.cardId)
        .then(
          (exists) => {
            if (exists) {
              fn();
              return Deck.swapCard(data.cardId, socket.data.name, 'default');
            }
            return Promise.resolve();
          },
          () => {},
        );
    });

    socket.on('disconnect', () => {
      if (socket.data.name !== null) deletePlayer(socket.data.name);
    });

    socket.on('get collection', (fn) => {
      Deck.getCollection(socket.data.name)
        .then(
          collection => fn(collection),
          () => fn([]),
        );
    });
  });

  state.webSocket = webSocket;
};

module.exports.get = () => state.webSocket;
