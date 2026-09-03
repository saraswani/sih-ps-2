const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

const authController = require('../controllers/authController');
const aiQuizController = require('../controllers/aiQuizController');
const gapAnalysisController = require('../controllers/gapAnalysisController');
const analyticsController = require('../controllers/analyticsController');

const { requireAuth, requireRole } = require('../middleware/auth');
const Skill = require('../models/Skill');
const JobRoleProfile = require('../models/JobRoleProfile');
const Course = require('../models/Course');

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', requireAuth, authController.getMe);

// AI MCQ Quiz routes
router.post('/quizzes/generate', upload.single('file'), aiQuizController.generateQuiz);
router.get('/quizzes/:id', aiQuizController.getQuizById);
router.post('/quizzes/submit', requireAuth, aiQuizController.submitQuizAttempt);

// Competency & Skill Gap routes
router.get('/gap-analysis', requireAuth, gapAnalysisController.getSkillGapAnalysis);
router.get('/recommendations', requireAuth, gapAnalysisController.getCourseRecommendations);
router.post('/competencies', requireAuth, gapAnalysisController.updateCompetencies);

// Taxonomy & Catalog Lookup routes
router.get('/skills', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ category: 1, name: 1 });
    res.json({ skills });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch skills taxonomy' });
  }
});

router.get('/job-roles', async (req, res) => {
  try {
    const roles = await JobRoleProfile.find();
    res.json({ roles });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch job role profiles' });
  }
});

router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json({ courses });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch course catalog' });
  }
});

// Analytics Dashboard routes
router.get('/analytics/learner', requireAuth, analyticsController.getLearnerAnalytics);
router.get('/analytics/admin', requireAuth, requireRole('admin'), analyticsController.getAdminAnalytics);

module.exports = router;
