import React from 'react';
import { Sparkles, Target, BookOpen, BarChart3, LayoutDashboard, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user } = useAuth();

  const navItems = [
    { id: 'landing', label: 'Platform Overview', icon: HelpCircle },
    { id: 'quiz-gen', label: 'AI MCQ Generator', icon: Sparkles, badge: 'Money Demo' },
    { id: 'gap-analysis', label: 'Skill Gap & iGOT Recommendations', icon: Target },
    { id: 'learner-db', label: 'Learner Dashboard', icon: LayoutDashboard },
    { id: 'admin-db', label: 'Admin Analytics', icon: BarChart3, adminOnly: true }
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isLocked = item.adminOnly && user?.role !== 'admin';

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`inline-flex items-center px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-2 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      {item.badge}
                    </span>
                  )}
                  {item.adminOnly && (
                    <span className="ml-2 text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded border border-amber-200">
                      Admin
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 my-2 rounded-lg border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2"></span>
            MoSPI Competency Framework Ready
          </div>
        </div>
      </div>
    </nav>
  );
}
