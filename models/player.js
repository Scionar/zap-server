const db = require('../db');

module.exports.add = (name) => {
  return new Promise((resolve, reject) => {
    db.get().scanAsync(0, 'match', `player:profile:${name}`)
    .then(
      scanValue => resolve(scanValue),
      scanValue => reject(scanValue)
    );
  })
  .then((scanValue) => {
    // If user does not already exist.
    if (!scanValue[1].length) {
      return db.get().hmsetAsync(`player:profile:${name}`, 'name', name);
    }
    return Promise.reject('Username already exists.');
  });
}

module.exports.getAll = () => {
  return db.get().scanAsync(0, 'match', 'player:profile:*').then((scanValue) => {
    return Promise.all(
      scanValue[1].map((key, index, array) => {return db.get().hgetallAsync(key)})
    )
  })
}

module.exports.deleteAll = () => {
  return db.get().scanAsync(0, 'match', 'player:profile:*').then((scanValue) => {
    return Promise.all(
      scanValue[1].map((key, index, array) => {return db.get().delAsync(key)})
    )
  })
}
