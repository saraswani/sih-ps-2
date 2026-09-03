import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Target, Award, BookOpen, Clock, AlertCircle, ExternalLink, Sliders, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import API from '../api';
import { useAuth } from '../context/AuthContext';

export default function LearnerDashboard({ onNavigateToQuiz }) {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [gaps, setGaps] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Self-assessment Sliders Modal State
  const [showSliderModal, setShowSliderModal] = useState(false);
  const [sliderScores, setSliderScores] = useState({
    'Survey Design': 65,
    'Sampling Methods': 70,
    'National Accounts': 50,
    'Price Statistics': 60,
    'Python': 40,
    'SQL': 65,
    'Data Privacy': 55,
    'Cybersecurity Awareness': 60,
    'Communication': 75
  });
  const [savingScores, setSavingScores] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, gapRes, recRes] = await Promise.all([
        API.get('/analytics/learner'),
        API.get('/gap-analysis'),
        API.get('/recommendations')
      ]);

      setAnalytics(analyticsRes.data);
      setGaps(gapRes.data.gaps || []);
      setRecommendations(recRes.data.recommendations || []);

      // Populate slider state with actual fetched scores
      if (gapRes.data.gaps) {
        const initialMap = {};
        gapRes.data.gaps.forEach(g => {
          initialMap[g.skill] = g.currentLevel;
        });
        setSliderScores(prev => ({ ...prev, ...initialMap }));
      }
    } catch (err) {
      console.error('Learner dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSaveSliders = async () => {
    setSavingScores(true);
    try {
      const formattedScores = Object.keys(sliderScores).map(skill => ({
        skill,
        level: sliderScores[skill]
      }));

      await API.post('/competencies', { competencyScores: formattedScores });
      setShowSliderModal(false);
      await fetchDashboardData();
    } catch (err) {
      console.error('Error saving self-assessment:', err);
      alert('Failed to update scores.');
    } finally {
      setSavingScores(false);
    }
  };

  const radarData = analytics?.radarData || [
    { category: 'Statistical', level: 65, fullMark: 100 },
    { category: 'Technical', level: 55, fullMark: 100 },
    { category: 'Digital Governance', level: 60, fullMark: 100 },
    { category: 'Behavioural', level: 75, fullMark: 100 }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Profile Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-200">
              Official Learner Profile
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ID: {user?._id || 'MOSPI-SO-2026'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {user?.name || 'Rajesh Kumar Verma'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            {user?.designation || 'Statistical Officer'} • {user?.department || 'National Accounts Division (NAD)'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Target Job Role Profile: <span className="font-bold text-slate-800">{analytics?.jobRole || 'Statistical Officer'}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowSliderModal(true)}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center space-x-2"
          >
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>Self-Assessment Sliders</span>
          </button>

          {onNavigateToQuiz && (
            <button
              onClick={onNavigateToQuiz}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl transition-all shadow-md flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Take Next Recommended AI Assessment</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">Avg Score</p>
            <p className="text-2xl font-black text-slate-900">{analytics?.stats?.avgScore || 82}%</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">Learning Hours</p>
            <p className="text-2xl font-black text-slate-900">{analytics?.stats?.learningHours || 24} hrs</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">Identified Gaps</p>
            <p className="text-2xl font-black text-amber-600">{gaps.filter(g => g.gap > 0).length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">Trainings Done</p>
            <p className="text-2xl font-black text-slate-900">{analytics?.stats?.trainingsCompletedCount || 4}</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Radar Chart & Skill Gap Ranked List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Radar Chart Component */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                Competency Radar Map
              </h3>
              <span className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-semibold">
                4 MoSPI Domains
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Visualizes current competency score distribution against required proficiency baselines.
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="category" tick={{ fill: '#334155', fontSize: 11, fontWeight: 700 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Radar name="Competency Level" dataKey="level" stroke="#047857" fill="#10b981" fillOpacity={0.45} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span className="text-slate-600">Statistical Competency</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
              <span className="text-slate-600">Technical Competency</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
              <span className="text-slate-600">Digital Governance</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
              <span className="text-slate-600">Behavioural Competency</span>
            </div>
          </div>
        </div>

        {/* Feature 2: Skill-Gap Analysis List */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-500" />
                Feature 2 — Skill-Gap Analysis
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Calculated by comparing current level against required min baseline for <span className="font-bold text-slate-800">{analytics?.jobRole || 'Statistical Officer'}</span>.
              </p>
            </div>
            <span className="text-xs bg-amber-50 text-amber-800 font-extrabold px-3 py-1 rounded-full border border-amber-200">
              Ranked by Deficit
            </span>
          </div>

          <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
            {gaps.map((item, idx) => {
              const isGap = item.gap > 0;
              return (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900">{item.skill}</span>
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium">
                        {item.category}
                      </span>
                    </div>

                    <span
                      className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        item.gap >= 25
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : item.gap >= 10
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : item.gap > 0
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {item.gap > 0 ? `Gap: -${item.gap} pts (${item.status})` : 'Proficient ✓'}
                    </span>
                  </div>

                  {/* Progress Bar comparison */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                      <span>Current: <b className="text-slate-800">{item.currentLevel}%</b></span>
                      <span>Target Baseline: <b className="text-slate-800">{item.minLevel}%</b></span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
                      <div
                        className={`h-full transition-all ${
                          item.gap >= 20 ? 'bg-amber-500' : 'bg-emerald-600'
                        }`}
                        style={{ width: `${item.currentLevel}%` }}
                      />
                      {item.gap > 0 && (
                        <div
                          className="h-full bg-red-400/60 transition-all"
                          style={{ width: `${item.gap}%` }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Feature 3: Personalized Course Recommendations */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              Feature 3 — Personalized Training Recommendation Engine
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Mapped to gap skills with level matching (Beginner for large gaps, Advanced for minor gaps).
            </p>
          </div>
          <div className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-3.5 py-1.5 rounded-xl text-xs font-semibold">
            iGOT / NSSTA Recommendation Engine (local catalogue — designed to sync via iGOT API in production)
          </div>
        </div>

        <div className="space-y-6">
          {recommendations.map((recGroup, gIdx) => (
            <div key={gIdx} className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <h4 className="text-sm font-bold text-slate-900">
                  Recommended for Gap Skill: <span className="text-emerald-700">{recGroup.gapSkill}</span>
                </h4>
                <span className="text-[10px] bg-red-100 text-red-800 font-extrabold px-2 py-0.5 rounded-full">
                  Deficit: -{recGroup.gapSize} pts
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recGroup.courses.map((course, cIdx) => (
                  <div
                    key={cIdx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                            course.provider === 'NSSTA-TPAC'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {course.provider}
                        </span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold">
                          {course.level}
                        </span>
                      </div>

                      <h5 className="text-xs font-extrabold text-slate-900 leading-snug line-clamp-2">
                        {course.title}
                      </h5>

                      <p className="text-[11px] text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-200/80 flex justify-between items-center text-xs">
                      <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {course.durationHours} hrs
                      </span>
                      <a
                        href={course.externalLink || 'https://igotkarmayogi.gov.in'}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center space-x-1 text-xs"
                      >
                        <span>Enroll on iGOT</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Self-Assessment Sliders Modal */}
      {showSliderModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-emerald-600" />
                  Self-Assessment Competency Sliders
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Adjust skill levels (0-100) to test live gap calculation and recommendations.
                </p>
              </div>
              <button
                onClick={() => setShowSliderModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold px-2"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {Object.keys(sliderScores).map((skillName, idx) => (
                <div key={idx} className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>{skillName}</span>
                    <span className="text-emerald-700">{sliderScores[skillName]}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderScores[skillName]}
                    onChange={(e) => setSliderScores({ ...sliderScores, [skillName]: parseInt(e.target.value) })}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowSliderModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSliders}
                disabled={savingScores}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl shadow-md"
              >
                {savingScores ? 'Saving...' : 'Save & Recalculate Gaps'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
