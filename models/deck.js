const db = require('../db');

/**
 * Check if promise exists in index. Using promise.
 * @param {string} name One level array of cards in deck.
 */
const collectionExists = (name) => {
  return db.get().lrangeAsync('deck:index', 0, -1)
  .then(
    list => (list.indexOf(name) !== -1) ? Promise.resolve() : Promise.reject(),
    () => new Error(`Checking collection ${name} from deck:index failed.`)
  )
}
module.exports.collectionExists = collectionExists;

/**
 * Empty collection or move all to other collection.
 * @param {string} target Name of the target collection.
 */
const emptyCollection = (target) => {
  return collectionExists(target)
  .then(
    () => db.get().delAsync(`deck:collection:${target}`),
    error => error
  );
}
module.exports.emptyCollection = emptyCollection;

/**
 * Create card deck. This method should be done before any use of other methods.
 * @param {array} cards One level array of cards in deck.
 */
module.exports.createDeck = (cards) => {
  return Promise.all([
    createCollection('default'),
    db.get().lpushAsync('deck:collection:default', ...cards)
  ]);
}

/**
 * Create new collection.
 * @param {string} name Name of the new collection.
 */
const createCollection = (name) => {
  return db.get().lpushAsync('deck:index', name)
}
module.exports.createCollection = createCollection;

/**
 * Remove collection. Removes name from index and deletes list of cards.
 * @param {string} name Name of the new collection.
 */
module.exports.removeCollection = (name) => {
  return Promise.all([
    db.get().delAsync(`deck:collection:${name}`),
    db.get().lremAsync('deck:index', 1, name)
  ]);
}

/**
 * Swap card from source collection to destination collection.
 * @param {string} card Name of card to switch.
 * @param {string} source Name of source collection.
 * @param {string} destination Name of the destination collection.
 */
module.exports.swapCard = (card, source, destination) => {
  return Promise.all([
    collectionExists(source),
    collectionExists(destination)
  ])
  .then(
    () => {
      return Promise.all([
        db.get().lremAsync(`deck:collection:${source}`, 1, card),
        db.get().lpushAsync(`deck:collection:${destination}`, card)
      ])
    },
    error => error
  );
}

/**
 * Move all to other collection.
 * @param {string} source Name of source collection.
 * @param {string} destination Name of the destination collection. Null if all cards will be removed.
 */
module.exports.swapCollection = (source, destination) => {
  return collectionExists(destination)
  .then(
    () => getCollection(source),
    error => error
  )
  .then(
    () => getCollection(source),
    error => error
  )
  .then(
    sourceCollection => db.get().lpushAsync(`deck:collection:${destination}`, ...sourceCollection),
    error => error
  )
  .catch(error => {throw error})
  .then(
    () => emptyCollection(source),
    error => error
  )
}

/**
 * Get collection content.
 * @param {string} name Name of the collection.
 */
const getCollection = (name) => {
  return collectionExists(name)
  .then(
    () => db.get().lrangeAsync(`deck:collection:${name}`, 0, -1),
    error => error
  );
}
module.exports.getCollection = getCollection;
