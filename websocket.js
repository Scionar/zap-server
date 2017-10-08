const socketIO = require('socket.io');
const addPlayer = require('./middleware/add-player');
const deletePlayer = require('./middleware/delete-player');
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

    socket.on('throw card', (data) => {
      console.log(data.cardId);
      // todo: Check if user really has this card.
      // todo: Move card to default collection.
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
