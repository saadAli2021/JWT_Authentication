require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

// Traditional function declaration
function verifyToken(req, res, next) {
  const auth = req.headers['authorization']; // bearer token
  const token = auth && auth.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.secret_key, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.use(express.json());
const posts = [
  {
    username: 'saad',
    title: 'post 1',
  },
  {
    username: 'ali',
    title: 'post 2',
  },
  {
    username: 'shah',
    title: 'post 3',
  },
];

app.get('/posts', verifyToken, (req, res) => {
  res.json(posts.filter(post=>post.username === req.user.name));
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const user = { name: req.body.username };

  const accessToken = jwt.sign(user, process.env.secret_key);
  res.json({ accessToken: accessToken });
});

app.listen(3000);
