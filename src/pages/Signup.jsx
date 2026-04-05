import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Cpu, Globe, KeyRound, Mail, Zap, User } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration sequence failed');
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };
  
  return (
    <div className="fixed inset-0 z-[100] bg-[#030303] flex items-center justify-center overflow-hidden font-sans text-white">
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

      {/* Ambient glowing orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#39ff14]/10 rounded-full blur-[100px] z-0 pointer-events-none mix-blend-screen" />

      {/* Language Switch */}
      <motion.button 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={toggleLanguage}
        className="absolute top-6 right-6 z-20 flex items-center gap-2 px-4 py-2 bg-black/40 border border-[#39ff14]/30 rounded-full text-[#39ff14] text-sm font-cyber hover:bg-[#39ff14]/10 hover:border-[#39ff14] hover:shadow-[0_0_15px_rgba(57,255,20,0.5)] transition-all backdrop-blur-md"
      >
        <Globe size={16} />
        {i18n.language === 'en' ? 'EN' : 'HI'}
      </motion.button>

      {/* Main Form Container */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md p-4"
      >
        <div className="relative backdrop-blur-xl bg-[#0a0a0a]/80 p-10 rounded-2xl border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
          
          {/* Top/Bottom Cyberpunk Bar Accents */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-[#39ff14] to-transparent shadow-[0_0_10px_#39ff14]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#39ff14]/50 to-transparent" />

          {/* Header */}
          <motion.div variants={itemVariants} className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-black border border-[#39ff14]/30 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(57,255,20,0.2)] relative">
              <Cpu size={32} className="text-[#39ff14]" />
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-dashed border-[#39ff14]/40 pointer-events-none"
              />
            </div>
            <h2 className="text-3xl font-cyber font-bold tracking-[0.2em] text-[#39ff14] drop-shadow-[0_0_10px_rgba(57,255,20,0.8)] uppercase text-center">
              {t('Signup')}
            </h2>
            <p className="text-[#39ff14]/60 text-xs tracking-widest mt-2 uppercase font-cyber text-center">System Registration</p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-900/40 border border-red-500/50 text-red-400 p-3 mb-6 rounded text-sm text-center font-cyber tracking-widest uppercase shadow-[0_0_10px_rgba(255,0,0,0.2)]"
            >
              [ ERR: {error} ]
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Name Input */}
            <motion.div variants={itemVariants} className="relative group">
              <label 
                className={`absolute left-0 -top-5 text-xs font-cyber tracking-widest uppercase transition-colors duration-300 ${focusedInput === 'name' ? 'text-[#39ff14]' : 'text-white/40'}`}
              >
                {t('Name')} Designation
              </label>
              <div className="relative flex items-center">
                <User className={`absolute left-4 z-10 size-5 transition-colors duration-300 ${focusedInput === 'name' ? 'text-[#39ff14]' : 'text-white/30'}`} />
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedInput('name')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="Subject 01"
                  className="w-full bg-[#111] border border-[#333] rounded-lg py-4 pl-12 pr-4 text-white font-sans focus:outline-none focus:border-[#39ff14] focus:shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all duration-300 placeholder:text-white/10"
                />
              </div>
            </motion.div>

            {/* Email Input */}
            <motion.div variants={itemVariants} className="relative group">
              <label 
                className={`absolute left-0 -top-5 text-xs font-cyber tracking-widest uppercase transition-colors duration-300 ${focusedInput === 'email' ? 'text-[#39ff14]' : 'text-white/40'}`}
              >
                {t('Email')} Directive
              </label>
              <div className="relative flex items-center">
                <Mail className={`absolute left-4 z-10 size-5 transition-colors duration-300 ${focusedInput === 'email' ? 'text-[#39ff14]' : 'text-white/30'}`} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="admin@system.io"
                  className="w-full bg-[#111] border border-[#333] rounded-lg py-4 pl-12 pr-4 text-white font-sans focus:outline-none focus:border-[#39ff14] focus:shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all duration-300 placeholder:text-white/10"
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants} className="relative group">
              <label 
                className={`absolute left-0 -top-5 text-xs font-cyber tracking-widest uppercase transition-colors duration-300 ${focusedInput === 'password' ? 'text-[#39ff14]' : 'text-white/40'}`}
              >
                Security Key
              </label>
              <div className="relative flex items-center">
                <KeyRound className={`absolute left-4 z-10 size-5 transition-colors duration-300 ${focusedInput === 'password' ? 'text-[#39ff14]' : 'text-white/30'}`} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="••••••••"
                  className="w-full bg-[#111] border border-[#333] rounded-lg py-4 pl-12 pr-4 text-white font-sans focus:outline-none focus:border-[#39ff14] focus:shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all duration-300 placeholder:text-white/10"
                />
              </div>
            </motion.div>

            {/* Signup Button */}
            <motion.button 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative w-full mt-2 bg-[#39ff14]/10 border border-[#39ff14] text-[#39ff14] font-cyber font-bold tracking-[0.15em] py-4 rounded-lg overflow-hidden transition-all hover:bg-[#39ff14] hover:text-black hover:shadow-[0_0_30px_rgba(57,255,20,0.6)]"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]" />
              <div className="flex items-center justify-center gap-2 relative z-10 uppercase">
                <Zap size={18} className="group-hover:animate-pulse" />
                CREATE PROTOCOL
              </div>
            </motion.button>
          </form>

          {/* Footer Link */}
          <motion.div variants={itemVariants} className="mt-8 text-center">
            <p className="text-sm text-white/50 font-sans">
              Existing entity?{' '}
              <Link to="/login" className="text-[#39ff14] font-cyber tracking-wider hover:text-white hover:drop-shadow-[0_0_8px_#39ff14] transition-all relative group inline-block">
                Access system
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#39ff14] transition-all group-hover:w-full"></span>
              </Link>
            </p>
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

export default Signup;
