require('dotenv').config();

const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const db = require('./db');
const webSocket = require('./websocket');
const apiController = require('./controllers/api');
const Game = require('./models/game');
const Deck = require('./models/deck');
const resetGame = require('./middleware/reset-game');
const addPlayer = require('./middleware/add-player');
const deletePlayer = require('./middleware/delete-player');

const app = express();
const server = http.Server(app);
webSocket.create(server);

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api', apiController);
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
  Game.getStatus().then((status) => {
    res.render('game', {
      game_on: (status === Game.GAME_STATUS_ON) ? 1 : 0,
      game_players: ['-', '-', '-'],
    });
  });
});

db.connect((err) => {
  if (err) {
    console.error('Unable to connect to database.');
    process.exit(1);
  } else {
    console.log('Database connection established.');
    resetGame().then(() => {
      server.listen(3001, () => {
        console.log('App listening on port :3001.');

        webSocket.get().on('connection', (socket) => {
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

          socket.on('disconnect', () => {
            deletePlayer(socket.data.name);
          });

          socket.on('get collection', (fn) => {
            Deck.getCollection(socket.data.name)
              .then(
                collection => fn(collection),
                () => fn([]),
              );
          });
        });
      });
    }, () => {
      console.log('Game status could not be reset. Check system.');
    });
  }
});
