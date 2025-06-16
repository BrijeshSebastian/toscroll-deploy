const express = require('express');
const http = require('http');
// const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const authRoutes = require('../routes/authRoutes');
const projectRoutes = require('../routes/projectRoutes');
const projectLogRoutes = require('../routes/projectLogs');

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// const io = new Server(server, {
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST'],
//     credentials: true,
//   }
// });

// const messageRoutes = require('../routes/messageRoutes')(io);

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/toscroll-backend/public', express.static(path.join(__dirname, '../public')));
app.use('/Uploads', express.static(path.join(__dirname, '../Uploads')));
app.use('/api/auth', authRoutes);
// app.use('/api/messages', messageRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/project-logs', projectLogRoutes);




async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      bufferCommands: false,
    });

    console.log('✅ MongoDB connected successfully');

    // Only after DB connects, export the app
    module.exports = app;

  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Exit process if DB connection fails
  }
}

startServer();
