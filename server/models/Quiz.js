const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  sourceTitle: { type: String, required: true },
  skillTag: { type: String, default: 'General Statistics' },
  category: { type: String, default: 'Statistical' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Official' },
  questions: [{
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctIndex: { type: Number, required: true },
    explanation: { type: String, required: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', quizSchema);
