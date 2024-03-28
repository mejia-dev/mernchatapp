const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const ws = require('ws');

const User = require('./models/User');
const Message = require('./models/Message');

dotenv.config();
mongoose.connect(process.env.MONGO_URL);
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));

async function getUserInfoFromRequest(req) {
  return new Promise((resolve, reject) => {
    const jwtCookie = req.cookies?.token;
    if (jwtCookie) {
      jwt.verify(jwtCookie, jwtSecret, {}, (err, userInfo) => {
        if (err) throw err;
        resolve(userInfo);
      });
    } else {
      reject('no token');
    }
  });
}

app.get('/test', (req, res) => {
  res.json('test ok');
});

app.get('/messages/:userId', async (req, res) => {
  const {userId} = req.params;
  const userInfo = await getUserInfoFromRequest(req);
  const requestingUserId = userInfo.userId;
  const messageList = await Message.find({
    sender:{$in:[userId,requestingUserId]},
    recipient:{$in:[userId,requestingUserId]},
  }).sort({createdAt: 1});
  res.json(messageList);
});

app.get('/profile', async (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, userInfo) => {
      if (err) throw err;
      res.json(userInfo);
    });
  } else {
    res.status(401).json('no token');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findOne({ username });
  if (foundUser) {
    const isPasswordCorrect = bcrypt.compareSync(password, foundUser.password);
    if (isPasswordCorrect) {
      jwt.sign({ userId: foundUser._id, username }, jwtSecret, {}, (err, token) => {
        if (err) throw err;
        res.cookie('token', token, { sameSite: 'none', secure: true }).json({
          id: foundUser._id,
        });
      });
    }
  }
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt)
    const createdUser = await User.create({
      username: username,
      password: hashedPassword
    });
    jwt.sign({ userId: createdUser._id, username }, jwtSecret, {}, (err, token) => {
      if (err) throw err;
      res.cookie('token', token, { sameSite: 'none', secure: true }).status(201).json({
        id: createdUser._id,
      });
    });
  } catch (err) {
    if (err) throw err;
    res.status(500).json('error');
  }
});

const server = app.listen(4040);

const wss = new ws.WebSocketServer({server});

wss.on("connection", (connection, req) => {
  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies.split(';').find(str => str.startsWith('token='));
    if (tokenCookieString) {
      const token = tokenCookieString.split('=')[1];
      if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userInfo) => {
          if (err) throw err;
          const {userId, username} = userInfo;
          connection.userId = userId;
          connection.username = username;
        });
      }
    }
  }

  connection.on('message', async (message) => {
    const messageData = JSON.parse(message.toString());
    const {recipientId, messageText} = messageData;
    if (recipientId && messageText) {
      const messageDoc = await Message.create({
        sender: connection.userId,
        recipient: recipientId,
        text: messageText,
      });
      [...wss.clients]
        .filter(c => c.userId === recipientId)
        .forEach(c => c.send(JSON.stringify({
          text: messageText,
          sender:connection.userId,
          recipient: recipientId,
          _id: messageDoc._id
        })));
    }
  });

  function notifyAboutActiveUsers() {
    [...wss.clients].forEach(cl => {
      cl.send(JSON.stringify({
        online: [...wss.clients].map(cl => ({userId:cl.userId, username:cl.username}))
      }));
    });
  }

  notifyAboutActiveUsers();
  
});