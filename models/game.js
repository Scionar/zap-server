const db = require('../db');

module.exports.GAME_STATUS_ON = '1';
module.exports.GAME_STATUS_OFF = '0';

module.exports.setStatus = value => db.get().setAsync('game:status', value);

module.exports.getStatus = () => db.get().getAsync('game:status');
