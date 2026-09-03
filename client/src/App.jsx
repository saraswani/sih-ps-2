import React, { useState } from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import QuizGenerator from './pages/QuizGenerator';
import LearnerDashboard from './pages/LearnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './context/AuthContext';
import { ShieldCheck, Heart } from 'lucide-react';

function MainLayout() {
  const [activeTab, setActiveTab] = useState('landing');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <div>
        <Header />
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'landing' && <LandingPage setActiveTab={setActiveTab} />}
          {activeTab === 'quiz-gen' && (
            <QuizGenerator onQuizCompleted={() => setActiveTab('learner-db')} />
          )}
          {(activeTab === 'gap-analysis' || activeTab === 'learner-db') && (
            <LearnerDashboard onNavigateToQuiz={() => setActiveTab('quiz-gen')} />
          )}
          {activeTab === 'admin-db' && <AdminDashboard />}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-6 mt-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-xs">
              M
            </div>
            <span className="font-semibold text-slate-300">
              MoSPI AI-Enabled Skill Intelligence & Learning Platform (SIH26101)
            </span>
          </div>

          <div className="flex items-center space-x-4 text-slate-400">
            <span>Mapped to iGOT Karmayogi Framework</span>
            <span>•</span>
            <span>NSSTA-TPAC Approved</span>
            <span>•</span>
            <span className="text-amber-400 font-bold">Smart India Hackathon 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
