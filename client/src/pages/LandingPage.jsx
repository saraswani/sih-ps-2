import React from 'react';
import { Sparkles, Target, BookOpen, ShieldCheck, Award, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import PitchPanel from '../components/PitchPanel';
import { useAuth } from '../context/AuthContext';

export default function LandingPage({ setActiveTab }) {
  const { quickDemoLogin } = useAuth();

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Interactive Pitch Banner for SIH Judges */}
      <PitchPanel onStartDemo={() => setActiveTab('quiz-gen')} />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-800 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 text-xs font-extrabold px-3.5 py-1.5 rounded-full border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Smart India Hackathon 2026 • Problem Statement SIH26101</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            AI-Enabled Skill Intelligence & Learning Platform for MoSPI
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Empowering India's Official Statistical System with automated competency assessment, AI-driven MCQ generation from training documents, skill-gap analysis, and personalized iGOT Karmayogi course recommendations.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('quiz-gen')}
              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-xl transition-all shadow-lg flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>Launch AI Quiz Generator (Demo)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('learner-db')}
              className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl transition-all border border-slate-700 flex items-center space-x-2"
            >
              <Target className="w-4 h-4 text-emerald-400" />
              <span>View Learner Radar & Skill Gaps</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">Feature 1: AI MCQ Generator</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Upload PDF/DOCX or paste training text. AI generates structured MCQs with correct answers & explanations.
          </p>
          <button
            onClick={() => setActiveTab('quiz-gen')}
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center space-x-1 pt-1"
          >
            <span>Test Generator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">Feature 2: Skill Gap Engine</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Compares competency scores against target job role baselines (e.g. Statistical Officer, Data Analyst).
          </p>
          <button
            onClick={() => setActiveTab('gap-analysis')}
            className="text-xs font-bold text-amber-700 hover:underline flex items-center space-x-1 pt-1"
          >
            <span>Inspect Gap Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">Feature 3: iGOT Recommendations</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Matches gap skills to iGOT Karmayogi & NSSTA-TPAC courses with automatic difficulty sorting.
          </p>
          <button
            onClick={() => setActiveTab('gap-analysis')}
            className="text-xs font-bold text-sky-700 hover:underline flex items-center space-x-1 pt-1"
          >
            <span>View Courses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">Feature 4: Visual Dashboards</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Recharts Radar charts for learners, and ministry-wide bar/area trend charts for administrators.
          </p>
          <button
            onClick={() => setActiveTab('admin-db')}
            className="text-xs font-bold text-indigo-700 hover:underline flex items-center space-x-1 pt-1"
          >
            <span>Open Admin Panel</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Role Selection Bar for Quick Demo Switching */}
      <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h4 className="text-sm font-extrabold text-slate-900">Quick Demo User Role Switcher</h4>
          <p className="text-xs text-slate-500 mt-0.5">Switch user context in 1-click to test Official Learner vs Ministry Executive views.</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => { quickDemoLogin('official'); setActiveTab('learner-db'); }}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm"
          >
            Login as Official (Rajesh Kumar)
          </button>
          <button
            onClick={() => { quickDemoLogin('admin'); setActiveTab('admin-db'); }}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-sm"
          >
            Login as Admin (Dr. Sengupta)
          </button>
        </div>
      </div>
    </div>
  );
}
