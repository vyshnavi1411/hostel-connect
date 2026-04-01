const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Basic Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running' });
});

// Basic Login Route
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  // TODO: Replace with real user lookup and bcrypt validation
  if (email && password) {
    res.json({ token: 'dummy_jwt_token', user: { id: 1, email } });
  } else {
    res.status(400).json({ message: 'Email and password are required' });
  }
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hostelconnect';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Socket.io
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
