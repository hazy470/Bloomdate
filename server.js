const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));
app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, 'views', 'signup.html')));
app.get('/swipe', (req, res) => res.sendFile(path.join(__dirname, 'views', 'swipe.html')));
app.get('/messages', (req, res) => res.sendFile(path.join(__dirname, 'views', 'messages.html')));
app.get('/settings', (req, res) => res.sendFile(path.join(__dirname, 'views', 'settings.html')));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));