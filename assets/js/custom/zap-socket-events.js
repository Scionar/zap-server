socket.on('update playerlist', (data) => {
  updatePlayers();
});

socket.on('start game', () => {
  showJoinScreen(false);
  showGameScreen(true);
});

socket.on('cards dealed', () => {
  socket.emit('get collection', (collection) => {
    console.log(collection);
  });
});
