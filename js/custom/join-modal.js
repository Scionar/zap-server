(function() {

  const socket = io();

  const joinButton = document.getElementById('join-button');
  const modalContainer = document.getElementById('modal-container');
  const joinModal = document.getElementById('join-modal');
  const registerNameField = document.getElementById('register-name-field');
  const registerButton = document.getElementById('register-button');
  const playerList = document.getElementById('player-list');
  const joinScreen = document.getElementById('join-screen');
  const gameScreen = document.getElementById('game-screen');

  function updatePlayers() {
    axios.post('/api/player/getall')
    .then((response) => {
      const users = response.data.players;
      playerList.childNodes.forEach((current, index, array) => {
        current.innerHTML = users[index] !== undefined ? users[index] : '-';
      });
    })
    .catch((error) => {
      console.log(error);
    });
  };

  function showJoinScreen(toggle) {
    if (toggle) {
      joinScreen.classList.remove('screen_hidden');
    } else {
      joinScreen.classList.add('screen_hidden');
    }
  }

  function showGameScreen(toggle) {
    if (toggle) {
      gameScreen.classList.remove('screen_hidden');
    } else {
      gameScreen.classList.add('screen_hidden');
    }
  }

  /**
   * Open joining modal.
   */
  joinButton.addEventListener('click', () => {
    joinModal.classList.remove('modal_hidden');
    modalContainer.classList.remove('modal-container_hidden');
  });

  /**
   * Close joining modal and send session registeration.
   */
  registerButton.addEventListener('click', () => {
    const name = registerNameField.value;

    if (name.length >= 2 && name.length <= 10) {
      registerNameField.value = '';

      axios.post('/api/player/add', {
        name
      })
      .then((response) => {
        joinModal.classList.add('modal_hidden');
        modalContainer.classList.add('modal-container_hidden');
      })
      .catch((error) => {
        console.log(error);
      });
    }
  });

  socket.on('update playerlist', (data) => {
    updatePlayers();
  });

  socket.on('start game', () => {
    showJoinScreen(false);
    showGameScreen(true);
  });

  updatePlayers();

})();
