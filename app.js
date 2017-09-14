require('dotenv').config()

const express = require('express');
const http = require('http');
const bodyParser = require("body-parser");
const pug = require('pug');
const db = require('./db');
const webSocket = require('./websocket');
const session = require('./session');
const apiController = require('./controllers/api');
const sessionController = require('./controllers/session');
const Game = require('./models/game');
const Player = require('./models/player');
const resetGame = require('./middleware/reset-game');
const addPlayer = require('./middleware/add-player');

const app = express();
const server = http.Server(app);
webSocket.create(server);
session.create();

app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session.getSession());
app.use('/api', apiController);
app.use('/session', sessionController);
app.use('/static', express.static('static'))

app.get('/', (req, res) => {
  if (!req.session.user) {
    req.session.role = 'watch';
  }
  Game.getStatus().then((status) => {
    res.render('game', {
      role: req.session.role,
      game_on: (status === Game.GAME_STATUS_ON) ? 1 : 0,
      game_players: ['-', '-', '-'],
      user_joined: req.session.user ? 1 : 0
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
          let playerAdded = false; // Todo: Better to be in user session.

          // socket.on('add player', (data, cb) => {
          //   const name = data.name;
          //   addPlayer(name)
          //   .then(cb());
          // });

          socket.on('disconnect', function () {
            // Todo: Remove user.
            socket.emit('update playerlist');
            socket.broadcast.emit('update playerlist');
          });
        });
      });
    }, (error) => {
      console.log('Game status could not be reset. Check system.');
    });
  }
});
