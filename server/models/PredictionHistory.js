const mongoose = require('mongoose');

const PredictionHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  crop: {
    type: String,
    required: true,
    trim: true
  },
  disease: {
    type: String,
    required: true,
    trim: true
  },
  confidence: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['healthy', 'diseased'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PredictionHistory', PredictionHistorySchema);
