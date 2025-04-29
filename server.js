const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/swipe', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'swipe.html'));
});

app.get('/messages', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'messages.html'));
});

app.get('/settings', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'settings.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});