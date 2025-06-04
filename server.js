const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Message = require('./models/Message');
const path = require('path')

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for testing
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/toscroll-backend/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
const messageRoutes = require('./routes/messageRoutes');
app.use('/api/messages', messageRoutes);
const projectRoutes = require('./routes/projectRoutes');
app.use('/api/projects', projectRoutes);


// // Socket.IO Chat
// let adminSocketId = null;

// io.on('connection', (socket) => {
//   console.log('✅ Socket connected:', socket.id);

//   // Admin identifies itself
//   socket.on('admin_connect', () => {
//     adminSocketId = socket.id;
//     console.log('🛠 Admin connected with socket ID:', adminSocketId);
//   });

//   socket.on('user_connect', (userId) => {
//     console.log('👤 User connected with userId:', userId);
//   });

//   socket.on('message', async (data) => {
//   console.log('📩 Received message:', data);
//   try {
// const message = {
//   text: data.text,
//   senderId: data.senderId || socket.id,
//   senderName: data.senderName || 'Unknown',
//   receiverId: data.receiverId || 'admin',
//   receiverName: data.receiverName || 'Admin'
// };

//     // Save to MongoDB
//     const newMessage = new Message(message);
//     await newMessage.save();
//     console.log('💾 Message saved with usernames');

//     // Send to receiver
//     if (message.receiverId === 'admin' && adminSocketId) {
//       io.to(adminSocketId).emit('message', message);
//     } else {
//       io.to(message.receiverId).emit('message', message);
//     }

//     socket.emit('message', message); // echo back to sender
//   } catch (err) {
//     console.error('❌ Error saving message:', err);
//   }
// });


//   socket.on('disconnect', () => {
//     console.log('❌ Socket disconnected:', socket.id);
//     if (socket.id === adminSocketId) {
//       adminSocketId = null;
//       console.log('🛠 Admin disconnected');
//     }
//   });
// });


// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});