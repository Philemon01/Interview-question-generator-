import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, Search, Sparkles, AlertCircle, RefreshCw, Clipboard, CheckCircle2 } from 'lucide-react';
import { getInterviewQuestions } from './lib/api';
import { sanitizeInput } from './lib/utils';

const SkeletonLoader = () => (
  <div className="space-y-4 w-full">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse shrink-0" />
          <div className="flex-1 space-y-3 pt-2">
            <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-white/5 rounded w-1/2 animate-pulse" />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-lemon/20 to-transparent animate-shimmer" />
      </div>
    ))}
  </div>
);

export default function App() {
  const [jobTitle, setJobTitle] = useState('Customer Success Manager');
  const [questions, setQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    
    const sanitizedTitle = sanitizeInput(jobTitle);
    if (!sanitizedTitle) {
      setError("Please enter a valid job title.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getInterviewQuestions(sanitizedTitle);
      setQuestions(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate questions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col items-center selection:bg-lemon/30">
      {/* Background Layer */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-slate-900 to-lime-950 -z-10" />
      <div className="fixed inset-0 bg-dotted opacity-30 -z-10" />
      
      {/* Decorative Orbs */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-lemon/10 rounded-full blur-[120px] -z-10" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-lime-900/20 rounded-full blur-[100px] -z-10" />

      <main className="w-full max-w-2xl px-6 py-12 md:py-24 flex-1 flex flex-col items-center">
        {/* Header - Centralized */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-3.5 bg-lemon/10 border border-lemon/20 rounded-2xl mb-6 shadow-[0_0_20px_rgba(190,242,100,0.1)]">
            <Clipboard className="w-8 h-8 text-lemon" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            INTERVIEW <span className="text-lemon">AI</span>
          </h1>
          <p className="text-slate-400 font-medium max-w-md mx-auto">
            Prepare with precision. Generate 3 behavioral questions for any role instantly.
          </p>
        </motion.div>

        {/* Action Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 p-2 rounded-3xl mb-12 shadow-2xl overflow-hidden relative group"
        >
          <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-2 relative z-10">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-lemon transition-colors" />
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Job Title (e.g. UX Designer)"
                className="w-full h-14 pl-12 pr-4 bg-transparent border-0 outline-none text-lg font-medium placeholder:text-slate-600 rounded-2xl focus:bg-white/[0.02] transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !jobTitle.trim()}
              className="h-14 px-8 bg-lemon text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-lemon-hover active:scale-95 transition-all shadow-[0_0_20px_rgba(190,242,100,0.3)] hover:shadow-[0_0_30px_rgba(190,242,100,0.5)] disabled:opacity-30 disabled:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Generate <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
          {/* Subtle animated border on focus */}
          <div className="absolute inset-0 border border-lemon/0 group-focus-within:border-lemon/20 transition-colors pointer-events-none rounded-3xl" />
        </motion.div>

        {/* Results / Feedback Area */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {error ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex flex-col items-center text-center gap-4"
              >
                <div className="bg-red-500/20 p-2 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="font-bold text-red-400">Generation Failed</h3>
                  <p className="text-red-400/70 text-sm mt-1">{error}</p>
                </div>
                <button 
                  onClick={() => handleGenerate()}
                  className="px-6 py-2 bg-red-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-600 transition-colors"
                >
                  Retry Now
                </button>
              </motion.div>
            ) : isLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center gap-2 mb-6 px-2">
                  <div className="w-2 h-2 bg-lemon rounded-full animate-bounce" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Architecting Questions</span>
                </div>
                <SkeletonLoader />
              </motion.div>
            ) : questions.length > 0 ? (
              <motion.div 
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-6 px-2">
                  <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-lemon" /> Recommended 3
                  </h2>
                  <div className="h-px flex-1 mx-4 bg-white/10" />
                  <span className="text-[10px] font-black px-2 py-0.5 border border-lemon/30 text-lemon rounded uppercase">AI Certified</span>
                </div>
                {questions.map((q, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-lemon/30 p-6 rounded-2xl shadow-xl transition-all cursor-default"
                  >
                    <div className="flex gap-5">
                      <span className="text-2xl font-black text-lemon transition-colors tabular-nums">
                        {idx + 1}
                      </span>
                      <p className="text-lg text-slate-300 font-medium leading-relaxed group-hover:text-white transition-colors">
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
                animate={{ opacity: 0.3 }}
                className="flex flex-col items-center justify-center py-20 text-slate-600 select-none grayscale"
              >
                <div className="mb-6 relative">
                  <Briefcase className="w-16 h-16" />
                  <div className="absolute inset-0 bg-lemon blur-3xl opacity-20" />
                </div>
                <p className="font-black text-xs uppercase tracking-[0.3em] text-center">Stand By for Input</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="w-full text-center py-8 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.25em] text-slate-600 bg-black/20 backdrop-blur-md">
        InterviewAI &bull; Secure AI Generation &bull; v1.0
      </footer>
    </div>
  );
}
