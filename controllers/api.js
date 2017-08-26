const express = require('express');
const Player = require('../models/player');
const addPlayer = require('../middleware/add-player');

const router = express.Router();

router.post('/player/add', (req, res) => {
  const name = req.body.name ? req.body.name : null;
  addPlayer(name, (status, msg) => {
    if (status === 'ok') {
      req.session.role = 'player';
      req.session.name = name;
      res.send({
        'status': 'ok'
      });
    } else {
      console.log(msg);
    }
  });
});

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
