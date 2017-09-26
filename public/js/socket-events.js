'use strict';

var socket = io();

socket.on('update playerlist', function (data) {
  updatePlayers();
});

socket.on('start game', function () {
  showJoinScreen(false);
  showGameScreen(true);
});