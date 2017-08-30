'use strict';

(function () {

  var socket = io();

  var joinButton = document.getElementById('join-button');
  var modalContainer = document.getElementById('modal-container');
  var joinModal = document.getElementById('join-modal');
  var registerNameField = document.getElementById('register-name-field');
  var registerButton = document.getElementById('register-button');
  var playerList = document.getElementById('player-list');
  var joinScreen = document.getElementById('join-screen');
  var gameScreen = document.getElementById('game-screen');

  function updatePlayers() {
    axios.get('/api/player/getall').then(function (response) {
      var users = response.data.players;
      playerList.childNodes.forEach(function (current, index, array) {
        current.innerHTML = users[index] !== undefined ? users[index].name : '-';
      });
    }).catch(function (error) {
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
  joinButton.addEventListener('click', function () {
    joinModal.classList.remove('modal_hidden');
    modalContainer.classList.remove('modal-container_hidden');
  });

  /**
   * Close joining modal and send session registeration.
   */
  registerButton.addEventListener('click', function () {
    var name = registerNameField.value;

    if (name.length >= 2 && name.length <= 10) {
      registerNameField.value = '';
      socket.emit('add player', { name: name }, function () {
        joinModal.classList.add('modal_hidden');
        modalContainer.classList.add('modal-container_hidden');
      });
    }
  });

  socket.on('update playerlist', function (data) {
    updatePlayers();
  });

  socket.on('start game', function () {
    showJoinScreen(false);
    showGameScreen(true);
  });

  updatePlayers();
})();