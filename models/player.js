const db = require('../db');

module.exports.add = (name, cb) => {
  return db.get().hmsetAsync(`player:profile:${name}`, 'name', name);
}

module.exports.getAll = () => {
  return db.get().scanAsync(0, 'match', 'player:profile:*').then((scanValue) => {
    return Promise.all(
      scanValue[1].map((key, index, array) => {return db.get().hgetallAsync(key)})
    )
  })
}

module.exports.deleteAll = (cb) => {
  return db.get().scanAsync(0, 'match', 'player:profile:*').then((scanValue) => {
    return Promise.all(
      scanValue[1].map((key, index, array) => {return db.get().delAsync(key)})
    )
  })
}
