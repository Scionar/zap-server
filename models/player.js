const db = require('../db');

module.exports.add = (name, cb) => {
  db.get().lpush('game:players', name, (error) => {
    if (error) throw error;
    cb();
  });
}

module.exports.getAll = (cb) => {
  db.get().lrange('player:all', 0, -1, (error, items) => {
    if (error) throw error;
    cb(items);
  });
}

module.exports.deleteAll = (cb) => {
  db.get().del('player:all', (error) => {
    if (error) throw error;
    cb();
  });
}
