socket.on('update playerlist', (data) => {
  updatePlayers();
});

socket.on('start game', () => {
  showJoinScreen(false);
  showGameScreen(true);
});

socket.on('cards dealed', () => {
  socket.emit('get collection', (collection) => {
    let index = 0;
    const setCardInterval = setInterval(function() {
      createCard(collection[index]); index++;
      if (index >= 5) clearInterval(setCardInterval);
    }, 300);
  });
});
