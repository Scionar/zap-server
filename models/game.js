const db = require('../db');

module.exports.GAME_STATUS_ON = '1';
module.exports.GAME_STATUS_OFF = '0';

module.exports.setStatus = (value, cb) => {
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
