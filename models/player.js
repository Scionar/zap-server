const db = require('../db');

module.exports.add = name => db.get().scanAsync(0, 'match', `player:profile:${name}`)
  .then((scanValue) => {
    // If user does not already exist.
    if (!scanValue[1].length) {
      return db.get().hmsetAsync(`player:profile:${name}`, 'name', name);
    }
    return Promise.reject(new Error('Username already exists.'));
  });

module.exports.delete = name => db.get().delAsync(`player:profile:${name}`);

module.exports.getAll = () => db.get().scanAsync(0, 'match', 'player:profile:*')
  .then(scanValue => Promise.all(scanValue[1]
    .map(key => db.get().hgetallAsync(key))));

module.exports.deleteAll = () => db.get().scanAsync(0, 'match', 'player:profile:*')
  .then(scanValue => Promise.all(scanValue[1].map(key => db.get().delAsync(key))));
