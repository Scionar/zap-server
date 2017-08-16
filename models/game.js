const db = require('../db');

module.exports.setGameStatus = (value, cb) => {
  db.get().set('game:status', value, (error) => {
    if (error) throw error;
    cb();
  });
}

module.exports.getGameStatus = (cb) => {
  db.get().get('game:status', (error, status) => {
    if (error) throw error;
    cb(status);
  });
}

module.exports.addPlayer = (name, cb) => {
  db.get().lpush('game:players', name, (error) => {
    if (error) throw error;
    cb();
  });
}

module.exports.getAllPlayers = (cb) => {
  db.get().lrange('game:players', 0, -1, (error, items) => {
    if (error) throw error;
    cb(items);
  });
}

module.exports.deleteAllPlayers = (cb) => {
  db.get().del('game:players', (error) => {
    if (error) throw error;
    cb();
  });
}
