const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use('/Uploads', express.static(path.join(__dirname, '..', 'Uploads')));
app.use(express.static(path.join(__dirname, '../public')));

// Routes
const authRoutes = require('../routes/authRoutes');
const projectRoutes = require('../routes/projectRoutes');
const projectLogRoutes = require('../routes/projectLogs');

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/project-logs', projectLogRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", time: new Date().toISOString() });
});



// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

module.exports = app;
