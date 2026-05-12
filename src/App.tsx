import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, Search, Sparkles, AlertCircle, RefreshCw, Clipboard } from 'lucide-react';
import { getInterviewQuestions } from './lib/api';
import { sanitizeInput } from './lib/utils';

export default function App() {
  const [jobTitle, setJobTitle] = useState('Customer Success Manager');
  const [questions, setQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle generation logic
  const handleGenerate = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    
    // Security check: Sanitization
    const sanitizedTitle = sanitizeInput(jobTitle);
    if (!sanitizedTitle) {
      setError("Please enter a valid job title (alphanumeric only).");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getInterviewQuestions(sanitizedTitle);
      setQuestions(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect to the interview engine.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200">
      <div className="max-w-2xl mx-auto px-6 py-20">
        
        {/* Header - Simple & Clean */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-slate-900 p-2 rounded-lg">
              <Clipboard className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">InterviewAI</h1>
          </div>
          <p className="text-slate-500 font-medium leading-relaxed">
            Generate role-specific behavioral questions to prepare for your next career move.
          </p>
        </header>

        {/* Search Section */}
        <section className="mb-10">
          <form onSubmit={handleGenerate} className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
            </div>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Lead Software Engineer"
              className="w-full h-14 pl-12 pr-32 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all font-medium"
            />
            <button
              type="submit"
              disabled={isLoading || !jobTitle.trim()}
              className="absolute right-2 top-2 bottom-2 px-5 bg-slate-900 text-white rounded-lg font-bold text-sm tracking-wide active:scale-95 disabled:opacity-30 disabled:scale-100 transition-all flex items-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Generate <Sparkles className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
          {jobTitle === 'Customer Success Manager' && questions.length === 0 && (
            <p className="mt-3 text-xs text-slate-400 uppercase tracking-widest font-bold">Default Example</p>
          )}
        </section>

        {/* Outcome Area */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              key="error"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-red-50 border border-red-100 rounded-xl p-5 flex gap-4 items-start"
            >
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold text-red-900 text-sm">System Error</h3>
                <p className="text-red-700/80 text-sm mt-1">{error}</p>
                <button 
                  onClick={() => handleGenerate()}
                  className="mt-3 text-xs font-bold text-red-900 underline underline-offset-4 hover:text-red-700 transition-colors flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Retry Generation
                </button>
              </div>
            </motion.div>
          )}

          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-white border border-slate-100 rounded-xl animate-pulse" />
              ))}
            </motion.div>
          ) : questions.length > 0 ? (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {questions.map((q, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:border-slate-300 hover:shadow-md transition-all group"
                >
                  <div className="flex gap-4">
                    <span className="flex-shrink-0 text-slate-300 font-mono font-bold pt-1">0{idx + 1}</span>
                    <p className="text-slate-700 leading-relaxed font-medium group-hover:text-slate-900">
                      {q}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              className="flex flex-col items-center justify-center py-24 text-slate-300 border-2 border-dashed border-slate-200 rounded-3xl"
            >
              <Briefcase className="w-12 h-12 mb-4" />
              <p className="font-bold text-sm tracking-widest uppercase">Start your screen prep</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compliance Note */}
        <footer className="mt-20 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">
          <div>Privacy Mode Enabled &bull; No PII Stored</div>
          <div>Powered by Google Gemini 1.5 Flash</div>
        </footer>
      </div>
    </div>
  );
}
