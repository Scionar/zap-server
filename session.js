const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const db = require('./db');

const state = {
  store: null,
  session: null
}

module.exports.create = () => {
  state.store = new RedisStore({
    client: db.get(),
  })

  state.session = session({
    store: state.store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
}

module.exports.getSession = () => {
  return state.session;
}

module.exports.getStore = () => {
  return state.store;
}
