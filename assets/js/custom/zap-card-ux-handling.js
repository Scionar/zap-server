/**
 * Show next card on the deck.
 */
function switchCard(element) {
  const hammer = new Hammer(element);
  hammer.get('swipe').set({ direction: Hammer.DIRECTION_RIGHT });
  hammer.on('swipe', function(ev) {
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

  window.setTimeout(function() {
    element.classList.remove('card_appear');
  }, 550);
}

/**
 * Return all cards.
 */
function returnAllCards() {
  const cards = document.getElementsByClassName('card');
  Array.from(cards).forEach(function(element, index) {
    window.setTimeout(function() {returnCard(element)}, 600 + (index * 150));
  });
}

/**
 * Throw card on the board.
 */
function throwCard(element) {
  const hammer = new Hammer(element);
  hammer.get('swipe').set({ direction: Hammer.DIRECTION_UP });
  hammer.on('swipe', function(ev) {
    ev.target.classList.add('card_thrown');

    const cardId = ev.target.getAttribute('data-card-id');
    socket.emit('throw card', {cardId});

    window.setTimeout(function() {ev.target.remove()}, 400);
    if (ev.target.previousElementSibling === null) {
      window.setTimeout(returnAllCards, 100);
    }
  });
}

/**
 * Get new card.
 */
function createCard(cardId) {
  const card = document.createElement('div');
  card.classList.add('card', 'card_get');
  card.setAttribute('data-card-id', cardId);
  card.innerHTML = cardId;
  const container = document.getElementsByClassName('deck-container')[0];

  new Promise((resolve, reject) => {
    container.appendChild(card);
    setTimeout(function() {resolve()}, 1000);
  })
  .then(() => {
    card.classList.remove('card_get');
    switchCard(card);
    throwCard(card);
  });
}
