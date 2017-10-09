const socketIO = require('socket.io');
const addPlayer = require('./middleware/add-player');
const deletePlayer = require('./middleware/delete-player');
const userHasCard = require('./middleware/user-has-card');
const Deck = require('./models/deck');
const Game = require('./models/game');

const state = {
  webSocket: null,
};

/**
 * Get webSocket instance.
 */
module.exports.get = () => state.webSocket;

/**
 * Create websocket instance and configure it.
 */
module.exports.create = (server) => {
  const webSocket = socketIO(server);

  webSocket.on('connection', (socket) => {
    /**
     * Initialize user data for new connection.
     */
    if (!socket.data) {
      socket.data = {
        name: null,
        role: 'watcher',
      };
    }

    /**
     * When user joins in game as a player. Set also user data into socket.
     */
    socket.on('add player', (data, fn) => {
      addPlayer(data.name)
        .then(
          () => {
            // Add user data to socket.
            socket.data.name = data.name;
            socket.data.role = 'player';
            fn({ status: 'ok' });
          },
          () => fn({ status: 'error' }),
        );
    });

    /**
     * When user send card to table. Also checks if user really has this card.
     */
    socket.on('throw card', (data, fn) => {
      userHasCard(socket.data.name, data.cardId)
        .then(
          (exists) => {
            if (exists) {
              fn();
              return Deck.swapCard(data.cardId, socket.data.name, 'table');
            }
            return Promise.resolve();
          },
          () => {},
        );
    });

    /**
     * Get user's own collection. If user is not player, table collection is
     * given.
     */
    socket.on('get own collection', (fn) => {
      let collectionName = 'table';
      if (socket.data.name || socket.data.role === 'player') {
        collectionName = socket.data.name;
      }

      Deck.getCollection(collectionName)
        .then(
          collection => fn(collection),
          () => fn([]),
        );
    });

    socket.on('get game status', (fn) => {
      Game.getStatus()
        .then(
          (status) => {
            const booleanStatus = (status === Game.GAME_STATUS_ON) || false;
            Promise.resolve(fn(booleanStatus));
          },
          () => {},
        )
        .catch((error) => { console.log(error); });
    });

    /**
     * Remove player data when disconnect.
     */
    socket.on('disconnect', () => {
      if (socket.data.name !== null) deletePlayer(socket.data.name);
    });
  });

  state.webSocket = webSocket;
};
