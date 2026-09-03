const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { 
    type: String, 
    enum: ['Statistical', 'Technical', 'DigitalGovernance', 'Behavioural'],
    required: true 
  },
  description: { type: String, required: true }
});

module.exports = mongoose.model('Skill', skillSchema);
