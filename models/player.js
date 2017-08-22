const db = require('../db');

module.exports.add = (name, cb) => {
  Promise.all([
    db.get().hmsetAsync(`player:profile:${name}`, 'name', name),
  ]).then(cb());
}

module.exports.getAll = (cb) => {
  db.get().scan(0, 'match', 'player:profile:*', (error, value) => {
    if (error) throw error;
    const keys = value[1];
    Promise.all(
      keys.map((key, index, array) => {return db.get().hgetallAsync(key)})
    ).then((response) => {
      cb(response);
    });
  });
}

module.exports.deleteAll = (cb) => {
  db.get().scan(0, 'match', 'player:profile:*', (error, value) => {
    if (error) throw error;
    const keys = value[1];
    Promise.all(
      keys.map((key, index, array) => {return db.get().delAsync(key)})
    ).then((response) => {
      cb(response);
    });
  });
}
