const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  provider: { type: String, enum: ['iGOT', 'NSSTA-TPAC'], default: 'iGOT' },
  skillsCovered: [{ type: String }],
  durationHours: { type: Number, default: 10 },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
  externalLink: { type: String, default: 'https://igotkarmayogi.gov.in' },
  category: String
});

module.exports = mongoose.model('Course', courseSchema);
