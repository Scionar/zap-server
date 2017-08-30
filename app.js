require('dotenv').config()

const express = require('express');
const http = require('http');
const session = require('express-session');
const bodyParser = require("body-parser");
const RedisStore = require('connect-redis')(session);
const pug = require('pug');
const db = require('./db');
const webSocket = require('./websocket');
const apiController = require('./controllers/api');
const Game = require('./models/game');
const Player = require('./models/player');
const resetGame = require('./middleware/reset-game');
const addPlayer = require('./middleware/add-player');

const app = express();
const server = http.Server(app);
webSocket.create(server);

app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  store: new RedisStore({
    client: db.get(),
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use('/api', apiController);
app.use('/static', express.static('static'))

app.get('/', (req, res) => {
  if (!req.session.role) {
    req.session.role = 'watch';
  }
  Game.getStatus()
  .then((status) => {
    res.render('game', {
      role: req.session.role,
      game_on: (status === Game.GAME_STATUS_ON) ? true : false,
      game_players: ['-', '-', '-']
    });
  });
});

db.connect((err) => {
  if (err) {
    console.error('Unable to connect to database.');
    process.exit(1);
  } else {
    console.log('Database connection established.');
    resetGame(() => {
      server.listen(3001, () => {
        console.log('App listening on port :3001.');

        webSocket.get().on('connection', (socket) => {
          let playerAdded = false; // Todo: Better to be in user session.

          socket.on('add player', (data, cb) => {
            const name = data.name;
            addPlayer(name, (status, msg) => {
              if (status === 'ok') {
                socket.emit('update playerlist');
                socket.broadcast.emit('update playerlist');
                cb();
              } else {
                console.log(msg);
              }
            });
          });

          socket.on('disconnect', function () {
            // Todo: Remove user.
            socket.emit('update playerlist');
            socket.broadcast.emit('update playerlist');
          });
        });
      });
    });
  }
});
