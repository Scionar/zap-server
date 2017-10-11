'use strict';

socket.on('update playerlist', function (data) {
  updatePlayers();
});

socket.on('start game', function () {
  showJoinScreen(false);
  showGameScreen(true);
});

socket.on('cards dealed', function () {
  getOwnCollection();
});

socket.on('give card', function (data) {
  createCard(data.card);
});