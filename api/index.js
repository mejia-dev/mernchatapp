const express = require('express');

const app = express();

app.get('/test', (req,res) => {
  res.json('test ok');
})

app.listen(4040);