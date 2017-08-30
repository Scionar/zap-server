const express = require('express');
const Player = require('../models/player');
const addPlayer = require('../middleware/add-player');

const router = express.Router();

router.get('/player/getall', (req, res) => {
  Player.getAll()
  .then((players) => {
    res.json({
      'status': 'ok',
      'players': players
    });
  });
});

module.exports = router;
