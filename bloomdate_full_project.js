const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'bloomdate_secret_key',
  resave: false,
  saveUninitialized: true,
}));

let users = [];
let likes = {};

// Home page
app.get('/', (req, res) => {
  res.send(`
    <html>
    <head><title>BloomDate</title><link rel="stylesheet" href="/style.css"></head>
    <body>
      <h1>Welcome to BloomDate</h1>
      <a href="/signup">Sign Up</a>
      ${bottomMenu('home')}
    </body>
    </html>
  `);
});

// Signup page
app.get('/signup', (req, res) => {
  res.send(`
    <html>
    <head><title>Signup - BloomDate</title><link rel="stylesheet" href="/style.css"></head>
    <body>
      <h2>Create Your Account</h2>
      <form action="/signup" method="POST">
        Username: <input name="username" required><br>
        Age: <input name="age" required><br>
        Interests: <input name="interest"><br>
        Looking For: <input name="lookingfor"><br>
        <button type="submit">Sign Up</button>
      </form>
      ${bottomMenu('signup')}
    </body>
    </html>
  `);
});

app.post('/signup', (req, res) => {
  const { username, age, interest, lookingfor } = req.body;
  const user = { id: Date.now().toString(), username, age, interest, lookingfor };
  users.push(user);
  req.session.user = user;
  res.redirect('/swipe');
});

// Swiping page
app.get('/swipe', (req, res) => {
  if (!req.session.user) return res.redirect('/signup');
  res.send(`
    <html>
    <head><title>Swipe - BloomDate</title><link rel="stylesheet" href="/style.css"></head>
    <body>
      <h2>Swipe Users</h2>
      <form action="/like" method="POST">
        ${users.filter(u => u.id !== req.session.user.id).map(u => `
          <div>
            <b>${u.username}</b> (${u.age}) - ${u.interest}
            <button name="likedUserId" value="${u.id}" type="submit">Like</button>
          </div>
        `).join('')}
      </form>
      ${bottomMenu('swipe')}
    </body>
    </html>
  `);
});

// Like action
app.post('/like', (req, res) => {
  const { likedUserId } = req.body;
  const myId = req.session.user.id;
  if (!likes[myId]) likes[myId] = [];
  likes[myId].push(likedUserId);

  if (likes[likedUserId] && likes[likedUserId].includes(myId)) {
    res.send(`
      <html>
      <head><title>It's a Match!</title><link rel="stylesheet" href="/style.css"></head>
      <body>
        <h1>It's a Match!</h1>
        <a href="/messages">Go to Messages</a>
        ${bottomMenu('swipe')}
      </body>
      </html>
    `);
  } else {
    res.redirect('/swipe');
  }
});

// Messages page
app.get('/messages', (req, res) => {
  if (!req.session.user) return res.redirect('/signup');
  res.send(`
    <html>
    <head><title>Messages - BloomDate</title><link rel="stylesheet" href="/style.css"></head>
    <body>
      <h2>Your Matches</h2>
      <p>(Coming soon)</p>
      ${bottomMenu('messages')}
    </body>
    </html>
  `);
});

// Settings page
app.get('/settings', (req, res) => {
  if (!req.session.user) return res.redirect('/signup');
  res.send(`
    <html>
    <head><title>Settings - BloomDate</title><link rel="stylesheet" href="/style.css"></head>
    <body>
      <h2>Settings</h2>
      <p>Username: ${req.session.user.username}</p>
      <p>Age: ${req.session.user.age}</p>
      <p>Interest: ${req.session.user.interest}</p>
      <p>Looking for: ${req.session.user.lookingfor}</p>
      <a href="/logout">Logout</a>
      ${bottomMenu('settings')}
    </body>
    </html>
  `);
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Bottom menu
function bottomMenu(active) {
  return `
    <div class="bottom-menu">
      <a href="/" class="${active === 'home' ? 'active' : ''}">Home</a>
      <a href="/swipe" class="${active === 'swipe' ? 'active' : ''}">Swipe</a>
      <a href="/messages" class="${active === 'messages' ? 'active' : ''}">Messages</a>
      <a href="/settings" class="${active === 'settings' ? 'active' : ''}">Settings</a>
    </div>
  `;
}

app.listen(PORT, () => {
  console.log(`BloomDate running at http://localhost:${PORT}`);
});