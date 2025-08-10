const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// Connect DB
connectDB(process.env.MONGODB_URI);

// Socket.IO
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  socket.on('join_conversation', (conversationId) => socket.join(conversationId));
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

// Routes
app.use('/api/conversations', require('./routes/conversationRoutes'));
app.use('/api', require('./routes/messageRoutes')(io));
app.use('/api', require('./routes/webhookRoutes')(io));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Fallback
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };
