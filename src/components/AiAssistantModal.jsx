import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Wand2, Calendar, ListChecks, ArrowRight, Zap, Target, Lightbulb } from 'lucide-react';
import { useState, useEffect } from 'react';

const AI_RULES = [
  { keywords: ['meeting', 'call', 'sync'], subtasks: ['Prepare agenda', 'Share meeting link', 'Take notes'], deadlineDays: 0 },
  { keywords: ['report', 'analyze', 'audit'], subtasks: ['Gather raw data', 'Draft summary', 'Final review'], deadlineDays: 2 },
  { keywords: ['code', 'develop', 'debug', 'fix'], subtasks: ['Plan architecture', 'Write tests', 'Implementation', 'Pull request'], deadlineDays: 3 },
  { keywords: ['travel', 'flight', 'book'], subtasks: ['Check documents', 'Pack bags', 'Confirm booking'], deadlineDays: 7 },
  { keywords: ['shop', 'buy', 'grocery'], subtasks: ['Make list', 'Compare prices', 'Checkout'], deadlineDays: 1 },
  { keywords: ['study', 'learn', 'read', 'course'], subtasks: ['Read materials', 'Take practice quiz', 'Review key concepts'], deadlineDays: 5 }
];

const AiAssistantModal = ({ taskTitle, isOpen, onClose, onApply }) => {
  const [suggestions, setSuggestions] = useState({ subtasks: [], deadline: null, improvedTitle: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && taskTitle) {
      generateSuggestions(taskTitle);
    }
  }, [isOpen, taskTitle]);

  const generateSuggestions = (title) => {
    setLoading(true);
    // Simulate AI thinking delay
    setTimeout(() => {
      const lowerTitle = title.toLowerCase();
      let matchedRule = AI_RULES.find(r => r.keywords.some(k => lowerTitle.includes(k)));
      
      if (!matchedRule) {
        matchedRule = { subtasks: ['Phase 1: Planning', 'Phase 2: Execution', 'Phase 3: Review'], deadlineDays: 2 };
      }

      const deadlineDate = new Date();
      deadlineDate.setDate(deadlineDate.getDate() + matchedRule.deadlineDays);

      setSuggestions({
        subtasks: matchedRule.subtasks,
        deadline: deadlineDate.toISOString().split('T')[0],
        improvedTitle: title.charAt(0).toUpperCase() + title.slice(1)
      });
      setLoading(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative max-w-2xl w-full glass-neon rounded-[2.5rem] overflow-hidden border-neon-green/30"
        >
          {/* Header */}
          <div className="relative p-8 md:p-10 bg-gradient-to-br from-neon-green/10 to-transparent">
            <button onClick={onClose} className="absolute top-6 right-6 text-white/30 hover:text-white p-2">
              <X size={20} />
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-neon-green/20 rounded-2xl flex items-center justify-center shadow-neon">
                <Sparkles className="text-neon-green" size={24} />
              </div>
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold tracking-tight">✨ Smart <span className="text-neon-green">Suggest</span></h2>
                <span className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold">Neural Task Breakdown</span>
              </div>
            </div>
            
            <p className="text-white/60 text-sm italic max-w-md">"Optimizing your workflow with AI-generated subtasks and prioritized schedules."</p>
          </div>

          <div className="p-8 md:p-10 space-y-10">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-6">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-2 border-neon-green/20 border-t-neon-green rounded-full shadow-neon"
                />
                <p className="text-xs text-white/40 font-mono tracking-widest animate-pulse uppercase">Analyzing task intent...</p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                {/* Title Section */}
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5 group">
                  <div className="flex items-center gap-3 mb-3 text-neon-green opacity-60">
                    <Lightbulb size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Enhanced Title</span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-neon-green transition-colors">{suggestions.improvedTitle}</h3>
                </div>

                {/* Subtasks Section */}
                <div>
                  <div className="flex items-center gap-3 mb-6 text-blue-400 opacity-60">
                    <ListChecks size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Suggested Subtasks</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {suggestions.subtasks.map((st, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="flex items-center gap-3 bg-white/5 px-5 py-4 rounded-2xl border border-white/5 hover:border-blue-400/30 transition-all group"
                      >
                        <Target className="text-blue-400 w-4 h-4 opacity-30 group-hover:opacity-100 transition-all" />
                        <span className="text-xs text-white/70 font-medium">{st}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Deadline Section */}
                <div>
                  <div className="flex items-center gap-3 mb-4 text-purple-400 opacity-60">
                    <Calendar size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Estimated Schedule</span>
                  </div>
                  <div className="inline-flex items-center gap-3 bg-purple-500/10 px-6 py-3 rounded-2xl border border-purple-500/20">
                    <span className="text-sm font-bold text-purple-400">Target Date:</span>
                    <span className="text-sm font-mono text-white/80">{new Date(suggestions.deadline).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 flex gap-4">
                  <button 
                    onClick={() => onApply(suggestions)}
                    className="btn-neon flex-grow py-5 text-lg shadow-neon group"
                  >
                    <Wand2 size={20} className="group-hover:rotate-12 transition-transform" />
                    Apply AI Optimization
                  </button>
                  <button 
                    onClick={onClose}
                    className="px-8 py-5 rounded-2xl border border-white/10 text-white/50 hover:text-white hover:bg-white/5 bg-transparent font-bold transition-all text-sm uppercase tracking-widest"
                  >
                    Dismiss
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AiAssistantModal;
