/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, Send, Loader2, AlertCircle, RefreshCw, ChevronRight } from 'lucide-react';
import { generateInterviewQuestions } from './services/gemini';

export default function App() {
  const [jobTitle, setJobTitle] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!jobTitle.trim()) return;

    setIsLoading(true);
    setError(null);
    setQuestions([]);

    try {
      const result = await generateInterviewQuestions(jobTitle);
      setQuestions(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans selection:bg-blue-100">
      {/* Background Decals */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/2 -right-24 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50" />
      </div>

      <main className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-slate-100 mb-6 group transition-transform hover:scale-105">
            <Briefcase className="w-8 h-8 text-blue-600 group-hover:rotate-12 transition-transform" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Interview Prep <span className="text-blue-600">AI</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
            Generate expert-level behavioral interview questions tailored to any role. 
            Prepare better, land the job.
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <form onSubmit={handleGenerate} className="relative group">
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              disabled={isLoading}
              className="w-full h-16 pl-6 pr-32 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-lg font-medium placeholder:text-slate-400 disabled:opacity-50 disabled:bg-slate-50"
            />
            <button
              type="submit"
              disabled={isLoading || !jobTitle.trim()}
              className="absolute right-2 top-2 bottom-2 px-6 bg-slate-900 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:bg-slate-400 group/btn"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <span>Generate</span>
                  <Send className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          {jobTitle && (
            <p className="mt-3 text-sm text-slate-400 italic flex items-center gap-1.5 ml-1">
              <ChevronRight className="w-4 h-4" />
              Preparing questions for <span className="text-slate-600 font-medium">{jobTitle}</span>
            </p>
          )}
        </motion.div>

        {/* Results Section */}
        <div className="space-y-6 min-h-[400px]">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4" />
                  <Briefcase className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600 animate-pulse" />
                </div>
                <p className="text-slate-500 font-medium">Analyzing job requirements...</p>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Consulting expert HR data</p>
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center"
              >
                <div className="inline-flex p-3 bg-red-100/50 rounded-full mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-red-900 mb-2">Something went wrong</h3>
                <p className="text-red-700/80 mb-6 max-w-sm mx-auto">{error}</p>
                <button 
                  onClick={() => handleGenerate()}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
              </motion.div>
            ) : questions.length > 0 ? (
              <motion.div 
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-4 px-2">
                  <h2 className="text-xl font-bold text-slate-800">Top 3 Questions</h2>
                  <span className="text-xs font-bold px-2.5 py-1 bg-green-100 text-green-700 rounded-full uppercase tracking-tighter">AI Curated</span>
                </div>
                {questions.map((q, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-default"
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center font-bold text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
                        {idx + 1}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-lg text-slate-700 font-medium leading-relaxed group-hover:text-slate-900 transition-colors">
                          {q}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center pt-8"
                >
                  <p className="text-sm text-slate-400">
                    Questions generated using <span className="font-semibold text-slate-500">Gemini 3 Flash</span>.
                  </p>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center opacity-40 grayscale hover:opacity-100 transition-all hover:grayscale-0"
              >
                <div className="w-20 h-20 bg-slate-200 rounded-3xl mb-6 flex items-center justify-center rotate-3 scale-90 group">
                  <Briefcase className="w-10 h-10 text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium italic">Type a job title above to begin your preparation.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-3xl mx-auto px-6 py-12 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-sm font-medium">
          &copy; {new Date().getFullYear()} Interview Prep AI &bull; Built for HR Excellence
        </p>
      </footer>
    </div>
  );
}
