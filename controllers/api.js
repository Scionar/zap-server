const express = require('express');
const Player = require('../models/player');

const router = express.Router();

router.get('/player/getall', (req, res) => {
  Player.getAll()
    .then((players) => {
      res.json({
        status: 'ok',
        players,
      });
    });
});

module.exports = router;
