import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Check, ShieldCheck, Sparkles, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const UpgradeModal = ({ isOpen, onClose, featureName }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const features = [
    { text: "AI Smart Suggest (Subtasks & Deadlines)", icon: Sparkles, color: "text-blue-400" },
    { text: "Advanced Performance Analytics", icon: Zap, color: "text-yellow-400" },
    { text: "Smart Reminders & Sync", icon: ShieldCheck, color: "text-purple-400" },
    { text: "Full Customization Themes", icon: AlertTriangle, color: "text-red-400" }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 40 }}
          className="relative max-w-lg w-full glass-neon p-8 md:p-10 rounded-[2.5rem] overflow-hidden border-neon-green/40 shadow-[0_0_50px_rgba(57,255,20,0.15)]"
        >
          {/* Animated Background Gradients */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-neon-green/10 rounded-full blur-[120px] -z-10 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[120px] -z-10" />
          
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-white/30 hover:text-white transition-colors hover:bg-white/5 rounded-full"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-neon-green/20 rounded-[2rem] flex items-center justify-center mb-8 shadow-neon relative group">
              <Zap size={40} className="text-neon-green group-hover:scale-110 transition-transform" />
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-10px] border border-dashed border-neon-green/30 rounded-full"
              />
            </div>
            
            <h2 className="text-3xl font-bold mb-3 tracking-tight">Unlock <span className="text-neon-green">Pro</span> Power</h2>
            <p className="text-white/60 mb-10 text-sm max-w-sm">
              {featureName ? `"${featureName}" is part of our professional suite. Upgrade to access all advanced tools.` : "Supercharge your productivity with TaskFlow Pro."}
            </p>

            <div className="w-full space-y-4 mb-10 text-left bg-white/5 p-6 rounded-3xl border border-white/5">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className={`p-2 rounded-xl bg-white/5 ${f.color} group-hover:scale-110 transition-transform`}>
                    <f.icon size={16} />
                  </div>
                  <span className="text-xs text-white/80 font-medium tracking-tight">{f.text}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => {
                navigate('/pricing');
                onClose();
              }}
              className="btn-neon w-full py-5 text-lg shadow-[0_10px_20px_rgba(57,255,20,0.3)] hover:shadow-[0_15px_30px_rgba(57,255,20,0.5)] active:scale-95 transition-all"
            >
              <Zap size={20} />
              Upgrade to TaskFlow Pro
            </button>
            
            <p className="mt-6 text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold flex items-center gap-2">
              <ShieldCheck size={12} className="text-neon-green/50" /> Secure Checkout • Cancel Anytime
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UpgradeModal;
