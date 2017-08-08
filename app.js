const express = require('express');
const pug = require('pug');

const app = express();

app.set('view engine', 'pug')
app.use('/static', express.static('static'))

app.get('/', (req, res) => {
  res.render('hand');
});

app.listen(3000, () => {
  console.log('Zap client listening on port :3000.');
});
