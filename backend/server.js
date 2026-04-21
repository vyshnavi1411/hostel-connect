const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/Message');

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

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/messages', require('./routes/messages'));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hostelconnect';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Socket.io
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('sendMessage', async (data) => {
    console.log('Message received from', socket.id, ':', data);
    try {
      if (!data.userId) {
        console.error('Error: userId is missing in sendMessage payload');
        return;
      }

      const newMessage = new Message({
        user: data.userId,
        text: data.text
      });
      await newMessage.save();
      
      const populatedMessage = await Message.findById(newMessage._id).populate('user', 'name role');
      console.log('Message saved and emitting to all clients');
      io.emit('receiveMessage', populatedMessage);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
