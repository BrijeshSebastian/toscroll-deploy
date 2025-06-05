const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const projectLogRoutes = require('./routes/projectLogs');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const messageRoutes = require('./routes/messageRoutes')(io); // Pass io to messageRoutes

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/toscroll-backend/public', express.static(path.join(__dirname, 'public')));
app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes); // Ensure this line is present
app.use('/api/projects', projectRoutes);
app.use('/api/project-logs', projectLogRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));




const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


