const express = require('express');
const pug = require('pug');
const db = require('./db');

const app = express();

app.set('view engine', 'pug')
app.use('/static', express.static('static'))

app.get('/', (req, res) => {
  res.render('hand');
});

db.connect((err) => {
  if (err) {
    console.error('Unable to connect to database.');
    process.exit(1);
  } else {
    console.log('Database connection established.');
    app.listen(3001, () => {
      console.log('Zap-server listening on port :3001.');
    });
  }
});
