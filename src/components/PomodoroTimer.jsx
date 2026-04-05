import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Bell, Zap } from 'lucide-react';

import { useTranslation } from 'react-i18next';

const PomodoroTimer = () => {
  const { t } = useTranslation();
  const [mode, setMode] = useState('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [boostActive, setBoostActive] = useState(false);
  const [showTooltip, setShowTooltip] = useState('');
  
  const timerRef = useRef(null);

  const modes = {
    work: { label: t('Focus'), time: 25 * 60, color: 'text-neon-green', bg: 'bg-neon-green/10', border: 'border-neon-green/20' },
    short: { label: t('Short Break'), time: 5 * 60, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
    long: { label: t('Long Break'), time: 15 * 60, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    setIsActive(false);
    setShowNotification(true);
    // Play a subtle sound if possible or show visual alert
    setTimeout(() => setShowNotification(false), 5000);
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(modes[mode].time);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setBoostActive(false);
    setTimeLeft(modes[newMode].time);
  };

  // ⚡ BOOST MODE: instant 5-min power sprint, auto-starts
  const activateBoost = () => {
    setBoostActive(true);
    setIsActive(false);
    setTimeLeft(5 * 60);
    setTimeout(() => setIsActive(true), 100);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((modes[mode].time - timeLeft) / modes[mode].time) * 100;

  return (
    <div className="glass p-6 rounded-3xl border border-white/10 flex flex-col items-center relative overflow-hidden group">
      {/* Background Pulse */}
      <AnimatePresence>
        {isActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 ${modes[mode].bg} blur-3xl -z-10 animate-pulse`}
          />
        )}
      </AnimatePresence>

      <div className="flex gap-2 mb-6 bg-black/40 p-1 rounded-xl border border-white/5">
        {Object.entries(modes).map(([key, config]) => (
          <button
            key={key}
            onClick={() => switchMode(key)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
              mode === key 
                ? `${config.bg} ${config.color} border ${config.border} shadow-sm` 
                : 'text-white/30 hover:text-white/60'
            }`}
          >
            {config.label}
          </button>
        ))}
      </div>

      <div className="relative w-48 h-48 flex items-center justify-center mb-6">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            className="stroke-white/5 fill-none"
            strokeWidth="8"
          />
          <motion.circle
            cx="96"
            cy="96"
            r="88"
            className={`fill-none ${modes[mode].color} stroke-current transition-colors duration-500`}
            strokeWidth="8"
            strokeDasharray="552.92"
            animate={{ strokeDashoffset: 552.92 - (552.92 * progress) / 100 }}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold font-mono tracking-tighter text-white">
            {formatTime(timeLeft)}
          </span>
          <span className={`text-[10px] uppercase tracking-[0.2em] font-bold opacity-50 ${modes[mode].color}`}>
            {isActive ? 'Syncing...' : 'Ready'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={resetTimer}
          className="p-3 rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all border border-white/10"
        >
          <RotateCcw size={20} />
        </button>
        
        <button
          onClick={toggleTimer}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
            isActive 
              ? 'bg-red-500/20 text-red-500 border border-red-500/40' 
              : 'bg-neon-green text-black shadow-neon hover:scale-105'
          }`}
        >
          {isActive ? <Pause size={28} /> : <Play size={28} className="translate-x-0.5" />}
        </button>

        <button
          onClick={activateBoost}
          onMouseEnter={() => setShowTooltip('boost')}
          onMouseLeave={() => setShowTooltip('')}
          title="⚡ Boost Mode — 5-min power sprint"
          className={`relative p-3 rounded-full transition-all border ${
            boostActive
              ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400/40 shadow-[0_0_15px_rgba(250,204,21,0.3)] animate-pulse'
              : 'bg-white/5 text-white/50 hover:text-yellow-400 hover:bg-yellow-400/10 hover:border-yellow-400/30 border-white/10'
          }`}
        >
          <Zap size={20} />
          {showTooltip === 'boost' && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/90 text-yellow-400 text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg whitespace-nowrap border border-yellow-400/20 shadow-lg">
              ⚡ Boost Sprint
            </div>
          )}
        </button>
      </div>

      {showNotification && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          className="absolute bottom-4 left-4 right-4 bg-neon-green text-black p-3 rounded-xl flex items-center gap-3 shadow-neon font-bold text-sm"
        >
          <Bell size={18} />
          Session Complete! Take a break.
        </motion.div>
      )}
    </div>
  );
};

export default PomodoroTimer;
