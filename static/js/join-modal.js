'use strict';

(function () {

  var socket = io();

  var joinButton = document.getElementById('join-button');
  var modalContainer = document.getElementById('modal-container');
  var joinModal = document.getElementById('join-modal');
  var registerNameField = document.getElementById('register-name-field');
  var registerButton = document.getElementById('register-button');
  var playerList = document.getElementById('player-list');

  function updatePlayers() {
    axios.post('/api/user/getall').then(function (response) {
      var users = response.data.players;
      playerList.childNodes.forEach(function (current, index, array) {
        current.innerHTML = users[index] !== undefined ? users[index] : '-';
      });
    }).catch(function (error) {
      console.log(error);
    });
  };

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

      axios.post('/api/user/register', {
        name: name
      }).then(function (response) {
        joinModal.classList.add('modal_hidden');
        modalContainer.classList.add('modal-container_hidden');
      }).catch(function (error) {
        console.log(error);
      });
    }
  });

  socket.on('update playerlist', function (data) {
    updatePlayers();
  });

  updatePlayers();
})();