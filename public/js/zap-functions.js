'use strict';

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
}

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

function getOwnCollection() {
  socket.emit('get own collection', function (collection) {
    if (collection.length) {
      var index = 0;
      var setCardInterval = setInterval(function () {
        createCard(collection[index]);index++;
        if (index >= collection.length) clearInterval(setCardInterval);
      }, 300);
    }
  });
}

function gameStatusAction(gameOn, gameOff) {
  socket.emit('get game status', function (status) {
    status ? gameOn() : gameOff();
  });
}

(function () {
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
      socket.emit('add player', { name: name }, function (data) {
        if (data.status === 'ok') {
          joinModal.classList.add('modal_hidden');
          modalContainer.classList.add('modal-container_hidden');
          joinButton.classList.add('button_hidden');
        }
      });
    }
  });

  gameStatusAction(function () {
    getOwnCollection();
  }, function () {
    updatePlayers();
  });
})();