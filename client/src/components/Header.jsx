import React from 'react';
import { ShieldCheck, Award, UserCheck, Layers, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, quickDemoLogin } = useAuth();

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 shadow-md">
      {/* Top Govt of India Strip */}
      <div className="bg-slate-950 px-4 py-1 text-xs font-medium text-slate-400 flex justify-between items-center border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center text-amber-500 font-semibold">
            🇮🇳 Government of India
          </span>
          <span className="text-slate-600">|</span>
          <span>Ministry of Statistics & Programme Implementation (MoSPI)</span>
        </div>
        <div className="flex items-center space-x-3 text-emerald-400">
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>iGOT Karmayogi Ecosystem Mapped</span>
          </span>
          <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded border border-amber-500/30">
            SIH 2026 • SIH26101
          </span>
        </div>
      </div>

      {/* Main Branding Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg text-white font-black text-xl border border-emerald-400/30">
            MoSPI
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Skill Intelligence & Learning Platform
              <span className="text-xs bg-emerald-500/20 text-emerald-300 font-normal px-2 py-0.5 rounded-full border border-emerald-500/30">
                AI-Enabled
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Competency Assessment • Skill-Gap Analysis • AI MCQ Generator • iGOT / NSSTA Recommendations
            </p>
          </div>
        </div>

        {/* User Role Indicator & Quick Switcher for Hackathon Live Demo */}
        <div className="flex items-center space-x-3 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
          <div className="text-right px-2">
            <p className="text-xs font-semibold text-slate-200">
              {user ? user.name : 'Rajesh Kumar Verma'}
            </p>
            <p className="text-[11px] text-emerald-400 flex items-center justify-end gap-1 font-medium">
              <UserCheck className="w-3 h-3" />
              {user?.role === 'admin' ? 'MoSPI Admin / Director' : 'Statistical Official'}
            </p>
          </div>

          <div className="flex space-x-1 border-l border-slate-700 pl-2">
            <button
              onClick={() => quickDemoLogin('official')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                user?.role !== 'admin'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
              title="Switch active user to Official Learner view"
            >
              Official View
            </button>
            <button
              onClick={() => quickDemoLogin('admin')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                user?.role === 'admin'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
              title="Switch active user to Ministry Admin view"
            >
              Admin View
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
