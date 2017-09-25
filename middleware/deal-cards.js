const Player = require('../models/player');
const Deck = require('../models/deck');

/**
 * Deal cards from default collection for existing players.
 * @param {integer} count How many cards to deal for one player.
 */
module.exports = (count) => {
  return Promise.all([
    Player.getAll(),
    Deck.getCollection('default')
  ])
  .then(
    values => {
      const players = values[0];
      let collection = values[1];
      const cards = [...Array(count * players.length)].map(() => {
        const randomIndex = Math.floor(Math.random() * collection.length);
        const card = collection.splice(randomIndex, 1)[0];
        return card;
      });

      return Promise.resolve([
        players,
        cards
      ]);
    },
    () => {throw new Error('Getting all data failed!')}
  )
  .then(
    values => {
      const players = values[0];
      const cards = values[1];

      const shares = cards.map((card, index) => {
        return {
          card,
          'player': players[Math.floor(index/count)].name
        }
      });

      return Promise.all(
        shares.map(share => {
          return Deck.swapCard(share.card, 'default', share.player)
        })
      );
    },
    () => {throw new Error('Forming player and card data failed!')}
  );
}
