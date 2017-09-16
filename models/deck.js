const db = require('../db');

/**
 * Check if promise exists in index. Using promise.
 *  @param {string} name One level array of cards in deck.
 */
const collectionExists = (name) => {
  return db.get().lrangeAsync('deck:index', 0, -1)
  .then((list) => {
    if (value.indexOf(value) !== -1) return Promise.resolve();
    return Promise.reject();
  });
}
module.exports.collectionExists = collectionExists;

/**
 * Empty collection or move all to other collection.
 * @param {string} target Name of the target collection.
 */
const emptyCollection = (target) => {
  return collectionExists(target)
  .then(
    () => {
      return db.get().delAsync(`deck:collection:${target}`)
    },
    () => {
      // todo: What here?
    }
  );
}
module.exports.emptyCollection = emptyCollection;

/**
 * Create card deck. This method should be done before any use of other methods.
 * @param {array} cards One level array of cards in deck.
 */
module.exports.createDeck = (cards) => {
  return Promise.all([
    db.get().lpushAsync('deck:index', 'default'),
    db.get().lpushAsync('deck:collection:default', ...cards)
  ]);
}

/**
 * Create new collection.
 * @param {string} name Name of the new collection.
 */
module.exports.createCollection = (name) => {
  return db.get().lpushAsync('deck:index', name)
}

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
    () => {
      // todo: What here?
    }
  );
}

/**
 * Move all to other collection.
 * @param {string} source Name of source collection.
 * @param {string} destination Name of the destination collection. Null if all cards will be removed.
 */
module.exports.swapCollection = (source, destination) => {
  return Promise.all([
    collectionExists(source),
    collectionExists(destination)
  ])
  .then(
    () => db.get().lrangeAsync(`deck:collection:${source}`, 0, -1),
    () => {
      // todo: What here?
    }
  )
  .then(
    (sourceCollection) => db.get().lpushAsync(`deck:collection:${target}`, ...sourceCollection),
    () => {
      // todo: What here?
    }
  )
  .then(
    () => emptyCollection(source),
    () => {
      // todo: What here?
    }
  )
}
