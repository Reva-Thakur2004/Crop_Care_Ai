const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const PredictionHistory = require('../models/PredictionHistory');
const { protect, restrictTo } = require('../middleware/auth');

// Multer Disk Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files (jpeg, jpg, png, gif) are allowed!'));
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// AI Service URL config
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Upload leaf photo and diagnose disease (Protected)
router.post('/predict', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Please upload an image file.'
      });
    }

    const filePath = req.file.path;
    
    // Create Form Data to forward to FastAPI
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath), req.file.filename);

    // Call FastAPI service
    let aiResponse;
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/predict`, form, {
        headers: {
          ...form.getHeaders()
        }
      });
      aiResponse = response.data;
    } catch (err) {
      console.error('Error contacting AI service:', err.message);
      return res.status(502).json({
        status: 'error',
        message: 'AI microservice is offline or returned an error.'
      });
    }

    // Save diagnosis to history
    // Compute image path as accessible URL path relative to backend root
    const imageUrl = `/uploads/${req.file.filename}`;

    const historyEntry = await PredictionHistory.create({
      userId: req.user._id,
      crop: aiResponse.crop,
      disease: aiResponse.disease,
      confidence: aiResponse.confidence,
      imageUrl: imageUrl,
      status: aiResponse.status
    });

    res.status(200).json({
      status: 'success',
      data: {
        prediction: aiResponse,
        historyEntry
      }
    });

  } catch (error) {
    console.error('Prediction API Error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Fetch Prediction History for current user (Protected)
router.get('/history', protect, async (req, res) => {
  try {
    // Basic sorting and filtering could be done query-side, or fetched in bulk
    const history = await PredictionHistory.find({ userId: req.user._id })
      .sort({ date: -1 });

    res.status(200).json({
      status: 'success',
      results: history.length,
      data: {
        history
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Fetch Global Prediction History (Protected, for admin/analytics)
router.get('/global-history', protect, restrictTo('admin'), async (req, res) => {
  try {
    const history = await PredictionHistory.find()
      .populate('userId', 'name email role')
      .sort({ date: -1 });

    res.status(200).json({
      status: 'success',
      results: history.length,
      data: {
        history
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;
