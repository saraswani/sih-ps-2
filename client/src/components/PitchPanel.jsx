import React, { useState } from 'react';
import { Info, Sparkles, CheckCircle2, ShieldCheck, ChevronDown, ChevronUp, Play } from 'lucide-react';

export default function PitchPanel({ onStartDemo }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 text-white rounded-2xl shadow-xl border border-slate-800 p-5 mb-8">
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setCollapsed(!collapsed)}>
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              How this Platform maps to MoSPI SIH26101 Requirements
              <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-medium">
                Judges Quick-Guide
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Designed for 36-Hour Hackathon Demo Clarity • End-to-End Functional Architecture
            </p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-white p-1">
          {collapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
        </button>
      </div>

      {!collapsed && (
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
            <h4 className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              1. Statistical Competency
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Survey Design, Sampling Methods, SNA 2008 National Accounts, Price Statistics & SDG Indicators.
            </p>
          </div>

          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
            <h4 className="font-bold text-sky-400 mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              2. Technical Competency
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Python Pandas, SQL queries, R time-series modeling, QGIS spatial statistics & Recharts visualization.
            </p>
          </div>

          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
            <h4 className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              3. Digital Governance
            </h4>
            <p className="text-slate-300 leading-relaxed">
              India DPDP Data Privacy compliance, CERT-In cybersecurity hygiene, digital signatures & MeghRaj cloud.
            </p>
          </div>

          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
            <h4 className="font-bold text-indigo-400 mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              4. Behavioural Competency
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Public leadership, inter-ministry communication, agile project delivery & statistical ethics.
            </p>
          </div>

          <div className="md:col-span-2 lg:col-span-4 bg-emerald-950/40 p-4 rounded-xl border border-emerald-500/30 flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="flex items-start space-x-3">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-emerald-300">90-Second Hackathon Demo Sequence:</h5>
                <p className="text-slate-300 text-[11px] mt-0.5">
                  1. Paste/Upload doc in <b>AI MCQ Generator</b> → 2. AI creates interactive quiz live → 3. Take quiz & submit score → 4. See score update in <b>Learner Radar Chart & Skill Gap</b> → 5. Inspect <b>iGOT Course Recommendations</b> → 6. Switch to <b>Admin Analytics</b>.
                </p>
              </div>
            </div>
            {onStartDemo && (
              <button
                onClick={onStartDemo}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg transition-all shadow-md shrink-0 flex items-center space-x-2 text-xs"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Launch Money Demo (AI MCQ)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
