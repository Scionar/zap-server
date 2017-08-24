const db = require('../db');

module.exports.GAME_STATUS_ON = '1';
module.exports.GAME_STATUS_OFF = '0';

module.exports.setStatus = (value) => {
  return db.get().setAsync('game:status', value);
}

module.exports.getStatus = () => {
  return db.get().getAsync('game:status');
}
