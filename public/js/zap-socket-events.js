'use strict';

socket.on('update playerlist', function (data) {
  updatePlayers();
});

socket.on('start game', function () {
  showJoinScreen(false);
  showGameScreen(true);
});

socket.on('cards dealed', function () {
  socket.emit('get collection', function (collection) {
    var index = 0;
    var setCardInterval = setInterval(function () {
      createCard(collection[index]);index++;
      if (index >= 5) clearInterval(setCardInterval);
    }, 300);
  });
});