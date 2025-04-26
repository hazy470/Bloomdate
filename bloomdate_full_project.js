
const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Users storage
let users = [];

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Serve HTML directly
app.get('/', (req, res) => {
  res.send(\`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>BloomDate</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f9f9f9; margin: 0; padding: 0; text-align: center; }
        h1 { color: #ff4d6d; margin-top: 20px; }
        .form-container { background: white; margin: 20px auto; padding: 20px; border-radius: 10px; width: 300px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        input, button { margin: 10px 0; padding: 10px; width: 90%; border: 1px solid #ccc; border-radius: 5px; }
        .profile-card { background: white; margin: 20px auto; padding: 20px; width: 300px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        img { max-width: 100px; border-radius: 50%; margin-bottom: 10px; }
      </style>
    </head>
    <body>

    <h1>BloomDate</h1>

    <div class="form-container" id="signup-form">
      <h2>Sign Up</h2>
      <input type="text" id="signup-username" placeholder="Username">
      <input type="password" id="signup-password" placeholder="Password">
      <input type="file" id="profile-picture" accept="image/*">
      <button onclick="signUp()">Sign Up</button>
    </div>

    <div class="form-container" id="login-form">
      <h2>Login</h2>
      <input type="text" id="login-username" placeholder="Username">
      <input type="password" id="login-password" placeholder="Password">
      <button onclick="logIn()">Login</button>
    </div>

    <div class="profile-card" id="profile-card" style="display:none;">
      <img id="profile-pic" src="">
      <h2 id="profile-name"></h2>
      <button onclick="likeUser()">Like</button>
      <button onclick="dislikeUser()">Dislike</button>
    </div>

    <script>
      async function signUp() {
        const username = document.getElementById('signup-username').value;
        const password = document.getElementById('signup-password').value;
        const profilePicture = document.getElementById('profile-picture').files[0];

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('profilePicture', profilePicture);

        await fetch('/signup', {
          method: 'POST',
          body: formData
        });

        alert('Sign up successful! Now log in.');
      }

      async function logIn() {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        const response = await fetch('/login', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({username, password})
        });

        if (response.ok) {
          document.getElementById('signup-form').style.display = 'none';
          document.getElementById('login-form').style.display = 'none';
          document.getElementById('profile-card').style.display = 'block';
          loadProfiles();
        } else {
          alert('Wrong credentials!');
        }
      }

      async function loadProfiles() {
        const res = await fetch('/users');
        const users = await res.json();

        if (users.length > 0) {
          const user = users[0];
          document.getElementById('profile-name').innerText = user.username;
          document.getElementById('profile-pic').src = '/uploads/' + user.profilePicture;
        } else {
          document.getElementById('profile-name').innerText = "No users yet.";
          document.getElementById('profile-pic').style.display = "none";
        }
      }

      function likeUser() {
        alert('You liked!');
      }

      function dislikeUser() {
        alert('You disliked!');
      }
    </script>

    </body>
    </html>
  \`);
});

// API routes
app.post('/signup', upload.single('profilePicture'), (req, res) => {
  const { username, password } = req.body;
  const userProfilePic = req.file ? req.file.filename : null;

  users.push({ username, password, profilePicture: userProfilePic });
  res.status(200).send('User signed up successfully');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.status(200).send('Login successful');
  } else {
    res.status(400).send('Invalid credentials');
  }
});

app.get('/users', (req, res) => {
  res.status(200).json(users);
});

// Start server
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
