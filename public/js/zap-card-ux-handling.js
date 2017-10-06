'use strict';

/**
 * Show next card on the deck.
 */
function switchCard(element) {
  var hammer = new Hammer(element);
  hammer.get('swipe').set({ direction: Hammer.DIRECTION_RIGHT });
  hammer.on('swipe', function (ev) {
    ev.target.classList.add('card_switched');
    if (ev.target.previousElementSibling === null) {
      window.setTimeout(returnAllCards, 100);
    }
  });
}

/**
 * Return card to the deck.
 */
function returnCard(element) {
  element.classList.remove('card_switched');
  element.classList.add('card_appear');

  window.setTimeout(function () {
    element.classList.remove('card_appear');
  }, 550);
}

/**
 * Return all cards.
 */
function returnAllCards() {
  var cards = document.getElementsByClassName('card');
  Array.from(cards).forEach(function (element, index) {
    window.setTimeout(function () {
      returnCard(element);
    }, 600 + index * 150);
  });
}

/**
 * Throw card on the board.
 */
function throwCard(element) {
  var hammer = new Hammer(element);
  hammer.get('swipe').set({ direction: Hammer.DIRECTION_UP });
  hammer.on('swipe', function (ev) {
    ev.target.classList.add('card_thrown');
    window.setTimeout(function () {
      ev.target.remove();
    }, 400);
    if (ev.target.previousElementSibling === null) {
      window.setTimeout(returnAllCards, 100);
    }
  });
}

/**
 * Get new card.
 */
function createCard(cardId) {
  var card = document.createElement('div');
  card.classList.add('card', 'card_get');
  card.setAttribute('data-card-id', cardId);
  card.innerHTML = cardId;
  var container = document.getElementsByClassName('deck-container')[0];

  new Promise(function (resolve, reject) {
    container.appendChild(card);
    setTimeout(function () {
      resolve();
    }, 1000);
  }).then(function () {
    card.classList.remove('card_get');
    switchCard(card);
    throwCard(card);
  });
}