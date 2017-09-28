const Player = require('../models/player');
const Deck = require('../models/deck');

/**
 * Create collections for all players when game starts.
 * @param {integer} count How many cards to deal for one player.
 */
module.exports = (count) => {
  return Player.getAll()
  .then(
    players => {
      return Promise.all(
        players.map((player) => Deck.createCollection(player.name))
      )
    },
    error => error
  )
  .catch(error => {console.log(error)});
}
