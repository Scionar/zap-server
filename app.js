require('dotenv').config()

const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const pug = require('pug');
const db = require('./db');

const app = express();

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

app.get('/', (req, res) => {
  if (!req.session.role) {
    req.session.role = 'watch';
  }
  res.render('game', {
    role: req.session.role,
    game_on: false
  });
});

db.connect((err) => {
  if (err) {
    console.error('Unable to connect to database.');
    process.exit(1);
  } else {
    console.log('Database connection established.');
    app.listen(3001, () => {
      console.log('Zap-server listening on port :3001.');
    });
  }
});
