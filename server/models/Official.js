const mongoose = require('mongoose');

const officialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['official', 'admin'], default: 'official' },
  designation: { type: String, default: 'Statistical Officer' },
  department: { type: String, default: 'National Accounts Division (NAD)' },
  jobRole: { type: String, default: 'Statistical Officer' },
  qualifications: [{ type: String }],
  workExperienceYears: { type: Number, default: 3 },
  pastTrainings: [{
    title: String,
    completedOn: Date,
    provider: String
  }],
  competencyScores: [{
    skill: String,
    category: { type: String, enum: ['Statistical', 'Technical', 'DigitalGovernance', 'Behavioural'] },
    level: { type: Number, min: 0, max: 100 }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Official', officialSchema);
