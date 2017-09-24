const Deck = require('../models/deck');

/**
 * This middleware expects that deck is already created.
 */
module.exports = (source, destination) => {
  return Deck.getCollection(source)
  .then(
    collection => {
      const randomIndex = Math.floor(Math.random() * collection.length);
      return Promise.resolve(collection[randomIndex]);
    },
    () => {throw new Error('Getting collection failed!')}
  )
  .then(
    card => Deck.swapCard(card, source, destination),
    () => {throw new Error('Returning random card failed!')}
  );
}
