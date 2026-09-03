import React, { useState } from 'react';
import { Sparkles, FileText, Upload, CheckCircle, AlertCircle, HelpCircle, ArrowRight, RefreshCw, Award, BookOpen } from 'lucide-react';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const PRESET_SAMPLES = [
  {
    title: 'MoSPI National Accounts Methodology Manual (SNA 2008)',
    skillTag: 'National Accounts',
    category: 'Statistical',
    text: `The National Accounts Division (NAD) of the Ministry of Statistics and Programme Implementation (MoSPI) compiles estimates of Gross Domestic Product (GDP) and Gross Value Added (GVA) at basic prices. Under the System of National Accounts (SNA 2008) framework adopted by India, GVA at basic prices is defined as total output minus intermediate consumption plus product subsidies minus product taxes. Imputed rent for owner-occupied dwellings is included to ensure comparability across housing tenure structures. Quarterly GDP estimates rely on high-frequency indicators including Index of Industrial Production (IIP), Consumer Price Index (CPI), and corporate financial performance data.`
  },
  {
    title: 'Survey Sampling Methods & Field Operations Protocols',
    skillTag: 'Sampling Methods',
    category: 'Statistical',
    text: `Field survey enumerators under the Field Operations Division (FOD) implement multi-stage stratified sampling for national socio-economic surveys. First Stage Units (FSUs) consist of census villages in rural areas and Urban Frame Survey (UFS) blocks in urban centers. Second Stage Units (SSUs) are households selected systematically with random start. Non-response mitigation protocols mandate a minimum of three field follow-up visits before replacing non-responsive households. Quality assurance audits require 10% re-enumeration by senior statistical supervisors to compute design effects and non-sampling error variances.`
  },
  {
    title: 'Digital Personal Data Protection (DPDP) Act Compliance for Microdata',
    skillTag: 'Data Privacy',
    category: 'DigitalGovernance',
    text: `MoSPI statistical dissemination portals must comply with the Digital Personal Data Protection (DPDP) Act 2023. Microdata unit records must undergo strict anonymization algorithms, including k-anonymity (k>=5) and l-diversity, to prevent re-identification of individual respondents. Personally Identifiable Information (PII) such as Aadhaar numbers, voter IDs, and full respondent names must be scrubbed prior to public release. Encrypted storage protocols on NIC MeghRaj cloud specify AES-256 encryption at rest and TLS 1.3 in transit.`
  }
];

export default function QuizGenerator({ onQuizCompleted }) {
  const { user } = useAuth();
  const [sourceTitle, setSourceTitle] = useState('');
  const [rawText, setRawText] = useState('');
  const [file, setFile] = useState(null);
  const [skillTag, setSkillTag] = useState('National Accounts');
  const [category, setCategory] = useState('Statistical');
  const [numQuestions, setNumQuestions] = useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quiz, setQuiz] = useState(null);

  // Quiz Taking State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const loadPresetSample = (sample) => {
    setSourceTitle(sample.title);
    setRawText(sample.text);
    setSkillTag(sample.skillTag);
    setCategory(sample.category);
    setFile(null);
    setError('');
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setSourceTitle(selectedFile.name);
      setError('');
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!file && (!rawText || rawText.trim().length < 20)) {
      setError('Please paste learning material (at least 20 chars) or upload a PDF/DOCX file.');
      return;
    }

    setLoading(true);
    setError('');
    setQuiz(null);
    setResult(null);
    setUserAnswers({});
    setCurrentQIndex(0);

    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }
      formData.append('rawText', rawText);
      formData.append('sourceTitle', sourceTitle || 'Custom Upload Material');
      formData.append('skillTag', skillTag);
      formData.append('category', category);
      formData.append('numQuestions', numQuestions);

      const res = await API.post('/quizzes/generate', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setQuiz(res.data.quiz);
    } catch (err) {
      console.error('Quiz generation error:', err);
      setError(err.response?.data?.error || 'Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionIndex, optionIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const handleSubmitQuiz = async () => {
    if (Object.keys(userAnswers).length < quiz.questions.length) {
      if (!confirm('You have unanswered questions. Do you still want to submit your assessment?')) {
        return;
      }
    }

    setSubmitting(true);
    try {
      const answersArray = quiz.questions.map((_, idx) => userAnswers[idx] ?? -1);
      const res = await API.post('/quizzes/submit', {
        quizId: quiz._id,
        answers: answersArray
      });

      setResult(res.data);
      if (onQuizCompleted) {
        onQuizCompleted();
      }
    } catch (err) {
      console.error('Quiz submission error:', err);
      alert('Failed to record assessment result. Please make sure you are logged in.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-emerald-500/30">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Feature 1 — Money Demo Moment</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              AI MCQ & Assessment Generator
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Upload PDF/DOCX material or paste official guidelines. Our LLM assessment engine auto-generates multi-choice evaluation questions mapped to MoSPI competency skills.
            </p>
          </div>
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 text-xs text-center shrink-0">
            <p className="text-slate-400 font-medium">Target Skill Tagged:</p>
            <p className="text-base font-bold text-amber-400 mt-0.5">{skillTag}</p>
            <span className="inline-block mt-1 text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
              Category: {category}
            </span>
          </div>
        </div>
      </div>

      {/* Preset 1-Click Samples Bar */}
      {!quiz && (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            1-Click Demo Document Presets (Instant Live Demo):
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PRESET_SAMPLES.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => loadPresetSample(sample)}
                className="text-left p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 line-clamp-1">
                    {sample.title}
                  </span>
                  <FileText className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 shrink-0 ml-1" />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                    Skill: {sample.skillTag}
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">
                    Preset #{idx + 1}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Creation Form */}
      {!quiz && (
        <form onSubmit={handleGenerate} className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-200 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Document Title / Source Name
              </label>
              <input
                type="text"
                value={sourceTitle}
                onChange={(e) => setSourceTitle(e.target.value)}
                placeholder="e.g. National Accounts Methodology Note"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Tag Target Skill
              </label>
              <select
                value={skillTag}
                onChange={(e) => setSkillTag(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="National Accounts">National Accounts (Statistical)</option>
                <option value="Survey Design">Survey Design (Statistical)</option>
                <option value="Sampling Methods">Sampling Methods (Statistical)</option>
                <option value="Price Statistics">Price Statistics (Statistical)</option>
                <option value="Python">Python Data Pipeline (Technical)</option>
                <option value="SQL">SQL Microdata Queries (Technical)</option>
                <option value="Data Privacy">Data Privacy & DPDP (Digital Governance)</option>
                <option value="Cybersecurity Awareness">Cybersecurity Awareness (Digital Governance)</option>
                <option value="Communication">Policy Communication (Behavioural)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Number of MCQs
              </label>
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value={3}>3 Questions (Fast Demo)</option>
                <option value={5}>5 Questions (Standard)</option>
                <option value={8}>8 Questions (Comprehensive)</option>
              </select>
            </div>
          </div>

          {/* Upload File / Paste Text Tabs */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Upload File (PDF / DOCX) OR Paste Learning Material
              </label>
              {file && (
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <CheckCircle className="w-3.5 h-3.5" />
                  File Selected: {file.name}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-emerald-500 transition-colors flex flex-col justify-center items-center bg-slate-50">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-xs font-semibold text-slate-700 mb-1">
                  Upload PDF or DOCX file
                </p>
                <p className="text-[11px] text-slate-500 mb-3">
                  Parses text using pdf-parse & mammoth
                </p>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                  id="file-upload"
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-slate-800 transition-all shadow-sm"
                >
                  Choose File
                </label>
              </div>

              <div className="md:col-span-2">
                <textarea
                  rows={6}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Or paste training manual text, official guidelines, or survey methodology paragraphs here..."
                  className="w-full p-4 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono text-slate-800"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-900 text-white font-extrabold text-base rounded-xl hover:opacity-95 transition-all shadow-lg flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>AI Assessment Designer is Generating Questions...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Generate Assessment MCQs Live</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Quiz Player View */}
      {quiz && !result && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Progress Header */}
          <div className="bg-slate-900 text-white p-6 border-b border-slate-800 flex justify-between items-center">
            <div>
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                Assessment: {quiz.sourceTitle}
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Question {currentQIndex + 1} of {quiz.questions.length}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700 font-semibold">
                Skill: {quiz.skillTag}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2">
            <div
              className="bg-emerald-500 h-2 transition-all duration-300"
              style={{ width: `${((currentQIndex + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="p-6 sm:p-8 space-y-6">
            <h4 className="text-lg font-extrabold text-slate-900 leading-snug">
              {quiz.questions[currentQIndex].question}
            </h4>

            <div className="space-y-3">
              {quiz.questions[currentQIndex].options.map((opt, optIdx) => {
                const isSelected = userAnswers[currentQIndex] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(currentQIndex, optIdx)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start space-x-3 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 shadow-sm font-medium'
                        : 'border-slate-200 hover:border-slate-400 bg-white text-slate-800'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="text-sm">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Nav controls */}
            <div className="flex justify-between items-center pt-6 border-t border-slate-100">
              <button
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex(prev => prev - 1)}
                className="px-4 py-2 text-xs font-bold text-slate-600 disabled:opacity-30 hover:bg-slate-100 rounded-lg transition-all"
              >
                Previous Question
              </button>

              {currentQIndex < quiz.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQIndex(prev => prev + 1)}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center space-x-1.5"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={submitting}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl transition-all shadow-md flex items-center space-x-1.5"
                >
                  <Award className="w-4 h-4" />
                  <span>{submitting ? 'Evaluating Assessment...' : 'Submit & View Score'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Results & AI Explanations Screen */}
      {result && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 space-y-8">
          {/* Score Header Banner */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 text-center space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <Award className="w-12 h-12 text-amber-400 mx-auto" />
            <h3 className="text-2xl font-black">Assessment Evaluation Completed!</h3>
            <div className="inline-flex items-center space-x-3 bg-slate-800 px-6 py-2 rounded-full border border-slate-700">
              <span className="text-3xl font-extrabold text-emerald-400">{result.score} / {result.totalQuestions}</span>
              <span className="text-slate-400">|</span>
              <span className="text-xl font-bold text-amber-300">{result.percentage}% Score</span>
            </div>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Your score has been processed and automatically updated into your competency profile for <span className="text-amber-400 font-bold">{quiz.skillTag}</span>.
            </p>
          </div>

          {/* Question Explanations List */}
          <div className="space-y-6">
            <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              Detailed AI Explanations & Key Takeaways:
            </h4>

            {quiz.questions.map((q, idx) => {
              const userAns = result.attempt?.answers?.[idx];
              const isCorrect = userAns === q.correctIndex;

              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border-2 transition-all space-y-3 ${
                    isCorrect ? 'border-emerald-200 bg-emerald-50/40' : 'border-red-200 bg-red-50/40'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h5 className="text-sm font-bold text-slate-900">
                      Q{idx + 1}. {q.question}
                    </h5>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                        isCorrect ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-red-100 text-red-800 border border-red-300'
                      }`}
                    >
                      {isCorrect ? 'Correct (+1)' : 'Incorrect'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, oIdx) => {
                      const isOptionCorrect = oIdx === q.correctIndex;
                      const isOptionChosen = userAns === oIdx;

                      let style = 'bg-white text-slate-700 border-slate-200';
                      if (isOptionCorrect) style = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                      else if (isOptionChosen) style = 'bg-red-100 border-red-300 text-red-950 font-semibold';

                      return (
                        <div key={oIdx} className={`p-2.5 rounded-lg border text-xs ${style}`}>
                          <span className="font-bold mr-1.5">{String.fromCharCode(65 + oIdx)}.</span>
                          {opt}
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl text-xs space-y-1 border border-slate-800">
                    <span className="text-amber-400 font-bold block">AI Explanation:</span>
                    <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-200">
            <button
              onClick={() => { setQuiz(null); setResult(null); }}
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all"
            >
              Create Another AI Assessment
            </button>

            {onQuizCompleted && (
              <button
                onClick={onQuizCompleted}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
              >
                <span>View Updated Skill Gaps & Course Recommendations</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
