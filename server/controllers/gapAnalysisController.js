const mongoose = require('mongoose');
const Official = require('../models/Official');
const JobRoleProfile = require('../models/JobRoleProfile');
const Course = require('../models/Course');
const localStore = require('../store');

exports.getSkillGapAnalysis = async (req, res) => {
  try {
    let official = null;
    let profile = null;
    const userId = req.user ? (req.user._id || req.user.id) : null;

    if (mongoose.connection.readyState === 1 && userId) {
      official = await Official.findById(userId);
      if (official) {
        profile = await JobRoleProfile.findOne({ roleName: official.jobRole });
      }
    }

    if (!official) {
      await localStore.initDefaultData();
      official = localStore.officials.find(u => (u._id || u.id) === userId) || localStore.officials[0];
      profile = localStore.jobRoleProfiles.find(p => p.roleName === official.jobRole) || localStore.jobRoleProfiles[0];
    }

    if (!profile) {
      profile = {
        roleName: official.jobRole || 'Statistical Officer',
        requiredSkills: [
          { skill: 'Survey Design', category: 'Statistical', minLevel: 80 },
          { skill: 'Sampling Methods', category: 'Statistical', minLevel: 75 },
          { skill: 'National Accounts', category: 'Statistical', minLevel: 70 },
          { skill: 'Python', category: 'Technical', minLevel: 65 },
          { skill: 'Data Privacy', category: 'DigitalGovernance', minLevel: 75 },
          { skill: 'Communication', category: 'Behavioural', minLevel: 80 }
        ]
      };
    }

    const currentScoresMap = new Map();
    (official.competencyScores || []).forEach(s => {
      currentScoresMap.set(s.skill.toLowerCase(), s.level);
    });

    const gapList = profile.requiredSkills.map(reqSkill => {
      const currentLevel = currentScoresMap.get(reqSkill.skill.toLowerCase()) || 0;
      const gap = Math.max(0, reqSkill.minLevel - currentLevel);
      let status = 'Proficient';
      if (gap >= 25) status = 'Critical Deficit';
      else if (gap >= 10) status = 'Moderate Deficit';
      else if (gap > 0) status = 'Minor Deficit';

      return {
        skill: reqSkill.skill,
        category: reqSkill.category || 'Statistical',
        currentLevel,
        minLevel: reqSkill.minLevel,
        gap,
        status
      };
    });

    gapList.sort((a, b) => b.gap - a.gap);

    res.json({
      jobRole: profile.roleName,
      officialName: official.name,
      department: official.department,
      gaps: gapList,
      totalGapsCount: gapList.filter(g => g.gap > 0).length
    });
  } catch (err) {
    console.error('Gap analysis error:', err);
    res.status(500).json({ error: 'Failed to compute skill gap analysis' });
  }
};

exports.getCourseRecommendations = async (req, res) => {
  try {
    let official = null;
    let profile = null;
    let allCourses = [];
    const userId = req.user ? (req.user._id || req.user.id) : null;

    if (mongoose.connection.readyState === 1 && userId) {
      official = await Official.findById(userId);
      if (official) {
        profile = await JobRoleProfile.findOne({ roleName: official.jobRole });
        allCourses = await Course.find();
      }
    }

    if (!official || allCourses.length === 0) {
      await localStore.initDefaultData();
      official = localStore.officials.find(u => (u._id || u.id) === userId) || localStore.officials[0];
      profile = localStore.jobRoleProfiles.find(p => p.roleName === official.jobRole) || localStore.jobRoleProfiles[0];
      allCourses = localStore.courses;
    }

    const currentScoresMap = new Map();
    (official.competencyScores || []).forEach(s => {
      currentScoresMap.set(s.skill.toLowerCase(), s.level);
    });

    const gapSkills = [];
    if (profile && profile.requiredSkills) {
      profile.requiredSkills.forEach(reqSkill => {
        const currentLevel = currentScoresMap.get(reqSkill.skill.toLowerCase()) || 0;
        const gap = reqSkill.minLevel - currentLevel;
        if (gap > 0) {
          gapSkills.push({ skill: reqSkill.skill, category: reqSkill.category, gap });
        }
      });
    }

    gapSkills.sort((a, b) => b.gap - a.gap);

    const recommendationsBySkill = gapSkills.map(gapItem => {
      const matchingCourses = allCourses.filter(course =>
        course.skillsCovered.some(s => s.toLowerCase().includes(gapItem.skill.toLowerCase()) || gapItem.skill.toLowerCase().includes(s.toLowerCase()))
      );

      matchingCourses.sort((a, b) => {
        if (gapItem.gap >= 25) {
          return (a.level === 'Beginner' ? -1 : 1);
        }
        return (a.level === 'Advanced' ? -1 : 1);
      });

      return {
        gapSkill: gapItem.skill,
        category: gapItem.category,
        gapSize: gapItem.gap,
        courses: matchingCourses.slice(0, 3)
      };
    });

    res.json({
      recommendations: recommendationsBySkill,
      disclaimer: "iGOT / NSSTA Recommendation Engine (local catalogue — designed to sync via iGOT API in production)"
    });
  } catch (err) {
    console.error('Course recommendation error:', err);
    res.status(500).json({ error: 'Failed to generate course recommendations' });
  }
};

exports.updateCompetencies = async (req, res) => {
  try {
    const { competencyScores } = req.body;
    const userId = req.user ? (req.user._id || req.user.id) : null;

    if (Array.isArray(competencyScores)) {
      if (mongoose.connection.readyState === 1 && userId) {
        const official = await Official.findById(userId);
        if (official) {
          competencyScores.forEach(item => {
            const existing = official.competencyScores.find(s => s.skill.toLowerCase() === item.skill.toLowerCase());
            if (existing) {
              existing.level = Math.min(100, Math.max(0, Number(item.level)));
            } else {
              official.competencyScores.push({ skill: item.skill, category: item.category || 'Statistical', level: Math.min(100, Math.max(0, Number(item.level))) });
            }
          });
          await official.save();
        }
      }

      await localStore.initDefaultData();
      let official = localStore.officials.find(u => (u._id || u.id) === userId) || localStore.officials[0];
      if (official && official.competencyScores) {
        competencyScores.forEach(item => {
          const existing = official.competencyScores.find(s => s.skill.toLowerCase() === item.skill.toLowerCase());
          if (existing) {
            existing.level = Math.min(100, Math.max(0, Number(item.level)));
          } else {
            official.competencyScores.push({ skill: item.skill, category: item.category || 'Statistical', level: Math.min(100, Math.max(0, Number(item.level))) });
          }
        });
      }
    }

    res.json({ message: 'Competency scores updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update competency scores' });
  }
};
