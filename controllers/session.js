const express = require('express');
const router = express.Router();
const addPlayer = require('../middleware/add-player.js');

router.get('/create', (req, res) => {
  if (!req.session.user) {
    const name = req.query.name || null;
    req.session.user = {
      name
    };
    addPlayer(name);
    console.log('User session created!');
    res.json({status: 'ok', msg: 'User session created!'});
  } else {
    console.log('User session already created!');
    res.json({status: 'no', msg: 'User session already created!'});
  }

});

module.exports = router;
