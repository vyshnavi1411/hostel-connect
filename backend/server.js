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

// Routes — complaints receives `io` so it can emit real-time status notifications
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/complaints', require('./routes/complaints')(io));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/mess-menu', require('./routes/messMenu'));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hostelconnect';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Socket.io
const activeUsers = new Map(); // socket.id -> { id, name, role }

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('userConnected', (user) => {
    if (user && (user.id || user._id)) {
      activeUsers.set(socket.id, user);
      io.emit('onlineUsers', Array.from(activeUsers.values()));
    }
  });

  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  socket.on('leaveRoom', (room) => {
    socket.leave(room);
    console.log(`Socket ${socket.id} left room ${room}`);
  });

  socket.on('sendMessage', async (data) => {
    try {
      if (!data.userId) return;

      const newMessage = new Message({
        user: data.userId,
        text: data.text,
        room: data.room || 'Global',
        recipient: data.recipient || null
      });
      await newMessage.save();

      const populatedMessage = await Message.findById(newMessage._id).populate('user', 'name role');

      if (data.recipient) {
        // Direct Message — find recipient & sender sockets, emit to both
        const recipientSocketIds = [];
        const senderSocketIds = [];

        for (const [id, user] of activeUsers.entries()) {
          if (user.id === data.recipient) recipientSocketIds.push(id);
          if (user.id === data.userId) senderSocketIds.push(id);
        }

        recipientSocketIds.forEach(id => io.to(id).emit('receiveMessage', populatedMessage));
        senderSocketIds.forEach(id => io.to(id).emit('receiveMessage', populatedMessage));

        // Emit DM notification to recipient (for the notification bell)
        const senderUser = activeUsers.get(socket.id);
        recipientSocketIds.forEach(id => io.to(id).emit('newDirectMessage', {
          recipientId: data.recipient,
          senderId: data.userId,
          senderName: senderUser ? senderUser.name : 'Someone'
        }));
      } else if (data.room) {
        io.to(data.room).emit('receiveMessage', populatedMessage);
      } else {
        io.emit('receiveMessage', populatedMessage);
      }
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('disconnect', () => {
    activeUsers.delete(socket.id);
    io.emit('onlineUsers', Array.from(activeUsers.values()));
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
