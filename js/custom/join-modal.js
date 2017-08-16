(function() {

  const joinButton = document.getElementById('join-button');
  const modalContainer = document.getElementById('modal-container');
  const joinModal = document.getElementById('join-modal');
  const registerNameField = document.getElementById('register-name-field');
  const registerButton = document.getElementById('register-button');
  const playerList = document.getElementById('player-list');

  function updatePlayers() {
    axios.post('/api/user/getall')
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

      axios.post('/api/user/register', {
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

  updatePlayers();

})();
