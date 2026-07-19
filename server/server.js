require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRouter = require('./routes/auth');
const predictionRouter = require('./routes/prediction');
const weatherRouter = require('./routes/weather');

app.use('/api/auth', authRouter);
app.use('/api/prediction', predictionRouter);
app.use('/api/weather', weatherRouter);

// Root & Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'AgriVision AI Backend Server is running smoothly',
    timestamp: new Date()
  });
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
  fs.mkdirSync(uploadsDir);
}

// Database Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cropcare';
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
