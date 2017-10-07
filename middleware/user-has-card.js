const Deck = require('../models/deck');

module.exports = (playerName, card) => Deck.collectionExists(playerName)
  .then(
    () => Deck.getCollection(playerName),
    () => new Error(`Error while checking if collection named '${playerName}' exists.`),
  )
  .catch(error => console.log(error))
  .then(
    collection => Promise.resolve(collection.indexOf(card) > -1),
    () => new Error(`Error while getting collection named '${playerName}'.`),
  )
  .catch(error => console.log(error));
