const mongoose = require('mongoose');

const jobRoleProfileSchema = new mongoose.Schema({
  roleName: { type: String, required: true, unique: true },
  description: String,
  requiredSkills: [{
    skill: { type: String, required: true },
    category: String,
    minLevel: { type: Number, required: true, min: 0, max: 100 }
  }]
});

module.exports = mongoose.model('JobRoleProfile', jobRoleProfileSchema);
