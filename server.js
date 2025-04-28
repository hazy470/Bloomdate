const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Session setup
app.use(session({
  secret: 'bloomdate_secret_key',
  resave: false,
  saveUninitialized: true,
}));

// Public files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Simulated simple database
let users = [];
let likes = {};

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Signup page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

// Handle signup
app.post('/signup', (req, res) => {
  const { username, age, interest, lookingfor } = req.body;
  const user = { id: Date.now(), username, age, interest, lookingfor };
  users.push(user);
  req.session.user = user;
  res.redirect('/swipe');
});

// Swiping page
app.get('/swipe', (req, res) => {
  if (!req.session.user) return res.redirect('/signup');
  res.sendFile(path.join(__dirname, 'views', 'swipe.html'));
});

// Like a user
app.post('/like', (req, res) => {
  const { likedUserId } = req.body;
  const myId = req.session.user.id;
  if (!likes[myId]) likes[myId] = [];
  likes[myId].push(likedUserId);
  
  // Check if it's a match
  if (likes[likedUserId] && likes[likedUserId].includes(String(myId))) {
    return res.json({ match: true });
  }
  
  res.json({ match: false });
});

// Messages page
app.get('/messages', (req, res) => {
  if (!req.session.user) return res.redirect('/signup');
  res.sendFile(path.join(__dirname, 'views', 'messages.html'));
});

// Settings page
app.get('/settings', (req, res) => {
  if (!req.session.user) return res.redirect('/signup');
  res.sendFile(path.join(__dirname, 'views', 'settings.html'));
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`BloomDate is running at http://localhost:${PORT}`);
});