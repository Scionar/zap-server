const Player = require('../models/player');
const Deck = require('../models/deck');
const pickOneCard = require('./pick-one-card');

/**
 * Deal cards from default collection for existing players.
 * @param {integer} count How many cards to deal for one player.
 */
module.exports = (count) => {
  return Player.getAll()
  .then(
    players => {
      // Go trough all all players.
      return Promise.all(
        players.map((player) => {
          // Get one card from default collection X times.
          return Promise.all(
            [...Array(count)].map(() => pickOneCard('default', player.name))
          )
        })
      );
    },
    () => {throw new Error('Getting all players failed!')}
  )
}
