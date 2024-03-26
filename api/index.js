const express = require('express');
const dotenv = require('dotenv');

dotenv.config();


const app = express();

app.get('/test', (req,res) => {
  res.json('test ok');
})

app.post('/register', (req,res) => {
  
})

app.listen(4040);