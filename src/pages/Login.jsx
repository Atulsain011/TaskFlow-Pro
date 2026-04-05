import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { KeyRound, Mail, Zap, Globe, Sun, Moon, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  
  const { login } = useContext(AuthContext);
  const { theme, changeTheme, language, changeLanguage } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login sequence failed');
    }
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'hi' : 'en';
    changeLanguage(newLang);
  };

  const cycleTheme = () => {
    const themes = ['neon', 'dark', 'light'];
    const idx = themes.indexOf(theme);
    changeTheme(themes[(idx + 1) % themes.length]);
  };

  const ThemeIcon = () => {
    if (theme === 'neon') return <Sparkles size={16} />;
    if (theme === 'dark') return <Moon size={16} />;
    return <Sun size={16} />;
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden font-sans bg-[#030303] text-white">
      {/* Background Animated Grid */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #39ff14 1px, transparent 1px),
            linear-gradient(to bottom, #39ff14 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 10%, transparent 70%)',
        }}
      >
        <motion.div 
          animate={{ y: [0, 40] }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-full h-full pointer-events-none"
        />
      </div>

      {/* Ambient glowing orb centered behind the card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#39ff14]/10 rounded-full blur-[100px] z-0 pointer-events-none" />

      {/* Top right floating controls */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 right-6 z-20 flex items-center gap-4"
      >
        <button 
          onClick={cycleTheme}
          className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-[#39ff14]/30 rounded-full text-[#39ff14] text-sm font-cyber uppercase tracking-wider backdrop-blur-md hover:bg-[#39ff14]/10 hover:border-[#39ff14] hover:shadow-[0_0_15px_rgba(57,255,20,0.5)] transition-all"
        >
          <ThemeIcon />
          <span>{theme}</span>
        </button>

        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-[#39ff14]/30 rounded-full text-[#39ff14] text-sm font-cyber uppercase tracking-wider backdrop-blur-md hover:bg-[#39ff14]/10 hover:border-[#39ff14] hover:shadow-[0_0_15px_rgba(57,255,20,0.5)] transition-all"
        >
          <Globe size={16} />
          <span>{language === 'en' ? 'EN' : 'HI'}</span>
        </button>
      </motion.div>

      {/* Main Form Card Container */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md p-6"
      >
        <div className="backdrop-blur-xl bg-black/60 p-10 rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative overflow-hidden group">
          
          {/* Card Border Glow Trims */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#39ff14] to-transparent shadow-[0_0_10px_#39ff14]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#39ff14]/50 to-transparent" />

          {/* Header */}
          <motion.div variants={itemVariants} className="flex flex-col items-center mb-10 w-full">
            <h2 className="text-3xl lg:text-4xl font-cyber font-bold tracking-[0.1em] text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)] uppercase text-center">
              Login to System
            </h2>
            <p className="text-[#39ff14]/80 text-sm tracking-widest mt-3 uppercase font-cyber text-center">
              System Authentication
            </p>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, scale: 0.9 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.9 }}
                className="bg-red-900/40 border border-red-500/50 text-red-500 p-3 mb-6 rounded text-sm text-center font-cyber tracking-widest uppercase shadow-[0_0_10px_rgba(255,0,0,0.2)]"
              >
                [ ERROR: {error} ]
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full">
            {/* Email Input */}
            <motion.div variants={itemVariants} className="relative w-full">
              <label 
                className={`absolute left-0 -top-6 text-xs font-cyber tracking-widest uppercase transition-colors duration-300 ${focusedInput === 'email' ? 'text-[#39ff14]' : 'text-white/40'}`}
              >
                Agent ID (Email) Directive
              </label>
              <div className="relative flex items-center w-full group/input">
                <Mail className={`absolute left-4 z-10 size-5 transition-colors duration-300 ${focusedInput === 'email' ? 'text-[#39ff14]' : 'text-white/30'}`} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="admin@system.io"
                  className="w-full bg-[#151515] hover:bg-[#1a1a1a] border border-[#333] rounded-xl py-4 flex-grow pl-14 pr-4 text-white font-sans focus:outline-none focus:border-[#39ff14] focus:shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all duration-300 placeholder:text-white/10"
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants} className="relative w-full mt-2">
              <label 
                className={`absolute left-0 -top-6 text-xs font-cyber tracking-widest uppercase transition-colors duration-300 ${focusedInput === 'password' ? 'text-[#39ff14]' : 'text-white/40'}`}
              >
                Security Key
              </label>
              <div className="relative flex items-center w-full group/input">
                <KeyRound className={`absolute left-4 z-10 size-5 transition-colors duration-300 ${focusedInput === 'password' ? 'text-[#39ff14]' : 'text-white/30'}`} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="••••••••"
                  className="w-full bg-[#151515] hover:bg-[#1a1a1a] border border-[#333] rounded-xl flex-grow py-4 pl-14 pr-4 text-white font-sans focus:outline-none focus:border-[#39ff14] focus:shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all duration-300 placeholder:text-white/10"
                />
              </div>
            </motion.div>

            {/* Login Button */}
            <motion.button 
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group/btn relative w-full mt-4 flex items-center justify-center bg-[#39ff14]/10 border border-[#39ff14] text-[#39ff14] font-cyber font-bold tracking-[0.2em] py-4 rounded-xl overflow-hidden transition-all duration-300 hover:bg-[#39ff14] hover:text-black hover:shadow-[0_0_30px_rgba(57,255,20,0.8)]"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1s_infinite]" />
              <div className="flex items-center justify-center gap-3 relative z-10 uppercase text-lg">
                <Zap size={22} className="group-hover/btn:animate-pulse" />
                Initialize
              </div>
            </motion.button>
          </form>

          {/* Footer Link */}
          <motion.div variants={itemVariants} className="mt-8 text-center w-full">
            <Link to="/signup" className="text-[#39ff14]/80 text-sm font-sans tracking-wide hover:text-[#39ff14] hover:drop-shadow-[0_0_8px_#39ff14] transition-all relative inline-block group/link">
              Unregistered entity? Establish Connection
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#39ff14] transition-all duration-300 group-hover/link:w-full"></span>
            </Link>
          </motion.div>
          
        </div>
      </motion.div>

      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
