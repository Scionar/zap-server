require('dotenv').config()

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const session = require('express-session');
const bodyParser = require("body-parser");
const RedisStore = require('connect-redis')(session);
const pug = require('pug');
const db = require('./db');
const game = require('./models/game');
const addPlayer = require('./middleware/add-player');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

app.set('view engine', 'pug')
app.use('/static', express.static('static'))
app.use(session({
  store: new RedisStore({
    client: db.get(),
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  if (!req.session.role) {
    req.session.role = 'watch';
  }
  res.render('game', {
    role: req.session.role,
    game_on: false,
    game_players: ['-', '-', '-']
  });
});

app.post('/api/player/add', (req, res) => {
  const name = req.body.name ? req.body.name : null;
  addPlayer(name, io, (status, msg) => {
    if (status === 'ok') {
      req.session.role = 'player';
      req.session.name = name;
      res.send({
        'status': 'ok'
      });
    } else {
      console.log(msg);
    }
  });
});

app.post('/api/player/getall', (req, res) => {
  game.getAllPlayers((players) => {
    res.send({
      'status': 'ok',
      'players': players
    });
  });
});

db.connect((err) => {
  if (err) {
    console.error('Unable to connect to database.');
    process.exit(1);
  } else {
    console.log('Database connection established.');
    game.setGameStatus(0, () => console.log('Game status set \'0\'.'));
    game.deleteAllPlayers(() => console.log('Removed existing players from database.'));
    server.listen(3001, () => {
      console.log('App listening on port :3001.');

      io.on('connection', (socket) => {
        let playerAdded = false; // Todo: Better to be in user session.

        socket.on('add player', (name) => {
          if (playerAdded) return;
          playerAdded = true;
          socket.emit('update playerlist');
          socket.broadcast.emit('update playerlist');
        });

        socket.on('disconnect', function () {
          // Todo: Remove user.
          socket.emit('update playerlist');
          socket.broadcast.emit('update playerlist');
        });
      });

    });
  }
});
