const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/civic_reporter';

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
  secret: 'civic-reporter-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});
const upload = multer({ storage: storage });

// Database connection
let db;

async function connectDB() {
  try {
    const client = await MongoClient.connect(MONGO_URI);
    db = client.db('civic_reporter');
    app.locals.db = db;
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Routes

// Authentication routes
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.send('<script>alert("All fields are required"); window.history.back();</script>');
    }

    const existingUser = await db.collection('users').findOne({ username });
    if (existingUser) {
      return res.send('<script>alert("Username already exists"); window.history.back();</script>');
    }

    const existingEmail = await db.collection('users').findOne({ email });
    if (existingEmail) {
      return res.send('<script>alert("Email already exists"); window.history.back();</script>');
    }

    await db.collection('users').insertOne({ 
      username, 
      email, 
      password,
      createdAt: new Date()
    });
    
    res.send('<script>alert("Registration successful! Please login."); window.location.href="/login.html";</script>');
  } catch (error) {
    console.error('Signup error:', error);
    res.send('<script>alert("Registration failed"); window.history.back();</script>');
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.send('<script>alert("Username and password required"); window.history.back();</script>');
    }

    const user = await db.collection('users').findOne({ username, password });
    if (!user) {
      return res.send('<script>alert("Invalid login credentials"); window.history.back();</script>');
    }

    req.session.userId = user._id;
    req.session.username = user.username;
    res.redirect('/main.html');
  } catch (error) {
    console.error('Login error:', error);
    res.send('<script>alert("Login failed"); window.history.back();</script>');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/index.html');
  });
});

// Issues routes
app.get('/issues', async (req, res) => {
  try {
    const issues = await db.collection('issues').find().sort({ createdAt: -1 }).toArray();
    res.json(issues);
  } catch (error) {
    console.error('Get issues error:', error);
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
});

app.post('/report-issue', upload.single('image'), async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.send('<script>alert("Please login first"); window.location.href="/login.html";</script>');
    }

    const { title, description, location, category } = req.body;
    
    if (!title || !description || !location) {
      return res.send('<script>alert("Please fill all required fields"); window.history.back();</script>');
    }

    const issueData = {
      userId: req.session.userId,
      username: req.session.username,
      title,
      description,
      location,
      category: category || 'General',
      status: 'Pending',
      createdAt: new Date(),
      image: req.file ? req.file.filename : null
    };

    await db.collection('issues').insertOne(issueData);
    res.send('<script>alert("Issue reported successfully!"); window.location.href="/view-issues.html";</script>');
  } catch (error) {
    console.error('Report issue error:', error);
    res.send('<script>alert("Failed to report issue"); window.history.back();</script>');
  }
});

// Profile routes
app.get('/profile-data', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await db.collection('users').findOne(
      { _id: req.session.userId },
      { projection: { password: 0 } }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Contact routes
app.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.send('<script>alert("All fields are required"); window.history.back();</script>');
    }

    await db.collection('contacts').insertOne({
      name,
      email,
      message,
      createdAt: new Date()
    });
    
    res.send('<script>alert("Thank you for contacting us! We will get back to you soon."); window.history.back();</script>');
  } catch (error) {
    console.error('Contact error:', error);
    res.send('<script>alert("Failed to send message"); window.history.back();</script>');
  }
});

// User issues route
app.get('/my-issues', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const issues = await db.collection('issues').find({ userId: req.session.userId }).sort({ createdAt: -1 }).toArray();
    res.json(issues);
  } catch (error) {
    console.error('Get user issues error:', error);
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
});

function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login.html');
  }
  next();
}
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});
await User.findByIdAndUpdate(req.user._id, { username, email });
app.get('/main.html', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

app.get('/profile.html', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

app.get('/report.html', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'report.html'));
});

app.get('/view-issues.html', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'view-issues.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📂 Serving static files from: ${path.join(__dirname, 'public')}`);
  });
}


startServer().catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

module.exports = app;
