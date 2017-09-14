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
    axios.get('/api/player/getall')
    .then((response) => {
      const users = response.data.players;
      playerList.childNodes.forEach((current, index, array) => {
        current.innerHTML = users[index] !== undefined ? users[index].name : '-';
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
      joinModal.classList.add('modal_hidden');
      modalContainer.classList.add('modal-container_hidden');
      axios.get('/session/create', {
        params: {
          name
        }
      })
      .then((response) => {
        if (response.data.status === 'ok') return Promise.resolve(response.data.msg);
        return Promise.reject(response.data.msg);
      })
      .then((msg) => {
        joinButton.classList.add('button_hidden');
      }, (msg) => {
        console.log(msg);
      })
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
