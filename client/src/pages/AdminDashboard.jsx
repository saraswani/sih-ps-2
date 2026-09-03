import React, { useState, useEffect } from 'react';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BarChart3, Users, Filter, TrendingUp, AlertTriangle, Building, Award, CheckCircle } from 'lucide-react';
import API from '../api';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchAdminAnalytics = async () => {
    setLoading(true);
    try {
      const res = await API.get('/analytics/admin', {
        params: { department: selectedDept, jobRole: selectedRole }
      });
      setData(res.data);
    } catch (err) {
      console.error('Admin analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminAnalytics();
  }, [selectedDept, selectedRole]);

  const categoryAverages = data?.categoryAverages || [
    { category: 'Statistical', averageScore: 64, target: 80 },
    { category: 'Technical', averageScore: 58, target: 75 },
    { category: 'Digital Governance', averageScore: 68, target: 80 },
    { category: 'Behavioural', averageScore: 74, target: 85 }
  ];

  const topOrgGaps = data?.topOrgGaps || [
    { skill: 'National Accounts', officialsAffectedCount: 14 },
    { skill: 'Python', officialsAffectedCount: 12 },
    { skill: 'Sampling Methods', officialsAffectedCount: 10 },
    { skill: 'Data Privacy', officialsAffectedCount: 9 },
    { skill: 'GIS', officialsAffectedCount: 7 }
  ];

  const completionTrend = data?.completionTrend || [
    { month: 'Apr', iGOTCourses: 42, nsstaWorkshops: 18, totalCompletions: 60 },
    { month: 'May', iGOTCourses: 55, nsstaWorkshops: 24, totalCompletions: 79 },
    { month: 'Jun', iGOTCourses: 68, nsstaWorkshops: 31, totalCompletions: 99 },
    { month: 'Jul', iGOTCourses: 84, nsstaWorkshops: 40, totalCompletions: 124 },
    { month: 'Aug', iGOTCourses: 102, nsstaWorkshops: 52, totalCompletions: 154 },
    { month: 'Sep', iGOTCourses: 125, nsstaWorkshops: 65, totalCompletions: 190 }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Admin Title & Filters Bar */}
      <div className="bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-amber-500/20 text-amber-300 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-500/30">
              Ministry Executive View
            </span>
            <span className="text-xs text-slate-400">Directorate General of Statistics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Organization-Wide Skill Analytics Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Ministry-wide competency tracking, capacity building trends, and gap identification across MoSPI divisions.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-800/90 p-3 rounded-xl border border-slate-700 w-full md:w-auto">
          <div className="flex items-center space-x-1.5 text-xs text-slate-300 font-semibold mr-1">
            <Filter className="w-4 h-4 text-emerald-400" />
            <span>Filters:</span>
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg border border-slate-700 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
          >
            {data?.filterOptions?.departments.map((d, i) => (
              <option key={i} value={d}>{d}</option>
            )) || <option value="All">All Departments</option>}
          </select>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg border border-slate-700 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
          >
            {data?.filterOptions?.jobRoles.map((r, i) => (
              <option key={i} value={r}>{r}</option>
            )) || <option value="All">All Job Roles</option>}
          </select>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-slate-100 text-slate-900 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">Officials Tracked</p>
            <p className="text-2xl font-black text-slate-900">{data?.totalOfficialsCount || 38}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">Org Avg Score</p>
            <p className="text-2xl font-black text-emerald-700">66%</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">Top Org Deficit</p>
            <p className="text-sm font-extrabold text-slate-900 truncate max-w-[140px]">National Accounts</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">iGOT Completions</p>
            <p className="text-2xl font-black text-purple-700">190+</p>
          </div>
        </div>
      </div>

      {/* Grid: Bar Charts for Category Averages & Most Common Skill Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Category Averages vs Targets */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              Org-Wide Average Competency by Category
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Compares ministry average score against target benchmarks across the 4 key MoSPI pillars.
            </p>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryAverages}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fill: '#334155', fontSize: 11, fontWeight: 600 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="averageScore" name="Org Average Score (%)" fill="#047857" radius={[6, 6, 0, 0]} />
                <Bar dataKey="target" name="Benchmark Target (%)" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Most Common Skill Gaps across Officials */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Most Common Skill Deficits Across Officials
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked list of skills requiring immediate capacity building and batch course allocation.
            </p>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topOrgGaps} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis dataKey="skill" type="category" width={130} tick={{ fill: '#334155', fontSize: 10, fontWeight: 700 }} />
                <Tooltip />
                <Bar dataKey="officialsAffectedCount" name="Officials Impacted" fill="#d97706" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart 3: Training Completion Trend Over Time */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Training Completion Trend (6-Month Growth)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tracks monthly completed courses across iGOT Karmayogi online portal and NSSTA physical workshops.
            </p>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-200">
            +45% Quarter-over-Quarter Growth
          </span>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={completionTrend}>
              <defs>
                <linearGradient id="colorIgot" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#047857" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#047857" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorNssta" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fill: '#334155', fontSize: 11, fontWeight: 600 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="iGOTCourses" name="iGOT Karmayogi Online Courses" stroke="#047857" fillOpacity={1} fill="url(#colorIgot)" />
              <Area type="monotone" dataKey="nsstaWorkshops" name="NSSTA Classroom Workshops" stroke="#6366f1" fillOpacity={1} fill="url(#colorNssta)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
