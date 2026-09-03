const mongoose = require('mongoose');
const Official = require('../models/Official');
const QuizAttempt = require('../models/QuizAttempt');
const localStore = require('../store');

exports.getLearnerAnalytics = async (req, res) => {
  try {
    const userId = req.user ? (req.user._id || req.user.id) : null;
    let official = null;
    let attempts = [];

    if (mongoose.connection.readyState === 1 && userId) {
      official = await Official.findById(userId);
      attempts = await QuizAttempt.find({ officialId: userId }).sort({ takenAt: -1 }).populate('quizId', 'sourceTitle skillTag');
    }

    if (!official) {
      await localStore.initDefaultData();
      official = localStore.officials.find(u => (u._id || u.id) === userId) || localStore.officials[0];
      attempts = localStore.quizAttempts.filter(a => a.officialId === (official._id || official.id));
    }

    const categoryTotals = {
      Statistical: { sum: 0, count: 0 },
      Technical: { sum: 0, count: 0 },
      DigitalGovernance: { sum: 0, count: 0 },
      Behavioural: { sum: 0, count: 0 }
    };

    (official.competencyScores || []).forEach(s => {
      const cat = s.category || 'Statistical';
      if (categoryTotals[cat]) {
        categoryTotals[cat].sum += s.level;
        categoryTotals[cat].count += 1;
      }
    });

    const radarData = [
      { category: 'Statistical', level: categoryTotals.Statistical.count ? Math.round(categoryTotals.Statistical.sum / categoryTotals.Statistical.count) : 65, fullMark: 100 },
      { category: 'Technical', level: categoryTotals.Technical.count ? Math.round(categoryTotals.Technical.sum / categoryTotals.Technical.count) : 55, fullMark: 100 },
      { category: 'Digital Governance', level: categoryTotals.DigitalGovernance.count ? Math.round(categoryTotals.DigitalGovernance.sum / categoryTotals.DigitalGovernance.count) : 60, fullMark: 100 },
      { category: 'Behavioural', level: categoryTotals.Behavioural.count ? Math.round(categoryTotals.Behavioural.sum / categoryTotals.Behavioural.count) : 75, fullMark: 100 }
    ];

    const quizzesTakenCount = attempts.length || 1;
    const avgScore = attempts.length > 0 ? Math.round(attempts.reduce((acc, curr) => acc + curr.percentage, 0) / attempts.length) : 82;
    const learningHours = 18 + quizzesTakenCount * 2;

    res.json({
      officialName: official.name,
      designation: official.designation,
      department: official.department,
      jobRole: official.jobRole,
      radarData,
      stats: {
        quizzesTakenCount,
        avgScore,
        learningHours,
        trainingsCompletedCount: official.pastTrainings ? official.pastTrainings.length : 4
      },
      recentAttempts: attempts.slice(0, 5),
      pastTrainings: official.pastTrainings || []
    });
  } catch (err) {
    console.error('Learner analytics error:', err);
    res.status(500).json({ error: 'Failed to generate learner analytics' });
  }
};

exports.getAdminAnalytics = async (req, res) => {
  try {
    const { department, jobRole } = req.query;
    let officials = [];

    if (mongoose.connection.readyState === 1) {
      const filter = { role: 'official' };
      if (department && department !== 'All') filter.department = department;
      if (jobRole && jobRole !== 'All') filter.jobRole = jobRole;
      officials = await Official.find(filter);
    }

    if (officials.length === 0) {
      await localStore.initDefaultData();
      officials = localStore.officials;
      if (department && department !== 'All') {
        officials = officials.filter(o => o.department === department);
      }
      if (jobRole && jobRole !== 'All') {
        officials = officials.filter(o => o.jobRole === jobRole);
      }
    }

    const categorySums = {
      Statistical: { sum: 0, count: 0 },
      Technical: { sum: 0, count: 0 },
      DigitalGovernance: { sum: 0, count: 0 },
      Behavioural: { sum: 0, count: 0 }
    };

    const skillGapFrequency = {};

    officials.forEach(off => {
      (off.competencyScores || []).forEach(s => {
        const cat = s.category || 'Statistical';
        if (categorySums[cat]) {
          categorySums[cat].sum += s.level;
          categorySums[cat].count += 1;
        }

        if (s.level < 70) {
          skillGapFrequency[s.skill] = (skillGapFrequency[s.skill] || 0) + 1;
        }
      });
    });

    const categoryAverages = [
      { category: 'Statistical', averageScore: categorySums.Statistical.count ? Math.round(categorySums.Statistical.sum / categorySums.Statistical.count) : 64, target: 80 },
      { category: 'Technical', averageScore: categorySums.Technical.count ? Math.round(categorySums.Technical.sum / categorySums.Technical.count) : 58, target: 75 },
      { category: 'Digital Governance', averageScore: categorySums.DigitalGovernance.count ? Math.round(categorySums.DigitalGovernance.sum / categorySums.DigitalGovernance.count) : 68, target: 80 },
      { category: 'Behavioural', averageScore: categorySums.Behavioural.count ? Math.round(categorySums.Behavioural.sum / categorySums.Behavioural.count) : 74, target: 85 }
    ];

    const topOrgGaps = Object.keys(skillGapFrequency)
      .map(skill => ({ skill, officialsAffectedCount: skillGapFrequency[skill] }))
      .sort((a, b) => b.officialsAffectedCount - a.officialsAffectedCount)
      .slice(0, 6);

    if (topOrgGaps.length === 0) {
      topOrgGaps.push(
        { skill: 'National Accounts', officialsAffectedCount: 14 },
        { skill: 'Python', officialsAffectedCount: 12 },
        { skill: 'Sampling Methods', officialsAffectedCount: 10 },
        { skill: 'Data Privacy', officialsAffectedCount: 9 },
        { skill: 'GIS', officialsAffectedCount: 7 }
      );
    }

    const completionTrend = [
      { month: 'Apr', iGOTCourses: 42, nsstaWorkshops: 18, totalCompletions: 60 },
      { month: 'May', iGOTCourses: 55, nsstaWorkshops: 24, totalCompletions: 79 },
      { month: 'Jun', iGOTCourses: 68, nsstaWorkshops: 31, totalCompletions: 99 },
      { month: 'Jul', iGOTCourses: 84, nsstaWorkshops: 40, totalCompletions: 124 },
      { month: 'Aug', iGOTCourses: 102, nsstaWorkshops: 52, totalCompletions: 154 },
      { month: 'Sep', iGOTCourses: 125, nsstaWorkshops: 65, totalCompletions: 190 }
    ];

    const departments = ['All', 'National Accounts Division (NAD)', 'Survey Design & Research Division (SDRD)', 'Field Operations Division (FOD)', 'Price Statistics Division (PSD)'];
    const jobRoles = ['All', 'Statistical Officer', 'Survey Officer', 'Data Analyst', 'Senior Statistical Officer'];

    res.json({
      totalOfficialsCount: officials.length || 38,
      categoryAverages,
      topOrgGaps,
      completionTrend,
      filterOptions: { departments, jobRoles }
    });
  } catch (err) {
    console.error('Admin analytics error:', err);
    res.status(500).json({ error: 'Failed to generate admin analytics' });
  }
};
