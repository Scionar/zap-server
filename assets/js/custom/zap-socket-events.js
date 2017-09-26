const socket = io();

socket.on('update playerlist', (data) => {
  updatePlayers();
});

socket.on('start game', () => {
  showJoinScreen(false);
  showGameScreen(true);
});
