const mongoose = require('mongoose');

const DiseaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Disease name is required'],
    trim: true
  },
  scientificName: {
    type: String,
    trim: true
  },
  crop: {
    type: String,
    required: [true, 'Crop name is required'],
    trim: true
  },
  symptoms: {
    type: [String],
    default: []
  },
  cause: {
    type: String,
    trim: true
  },
  spread: {
    type: String,
    trim: true
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  affectedParts: {
    type: [String],
    default: []
  },
  treatment: {
    organic: {
      type: [String],
      default: []
    },
    chemical: {
      type: [String],
      default: []
    }
  },
  dosage: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Disease', DiseaseSchema);
