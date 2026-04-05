import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { LogOut, Sun, Moon, Monitor, HelpCircle, Zap, Sparkles } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import HelpModal from './HelpModal';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, changeTheme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleThemeClick = () => {
    const themes = ['neon', 'dark', 'light'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    changeTheme(themes[nextIndex]);
  };

  const themeIcon = theme === 'neon' ? <Monitor size={20} /> : theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />;
  const themeLabel = theme === 'neon' ? 'Neon' : theme === 'dark' ? 'Dark' : 'Light';

  return (
    <>
      <nav className="glass sticky top-0 z-40 w-full py-4 px-6 border-b border-white/5 backdrop-blur-3xl shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group relative">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 bg-neon-green rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(57,255,20,0.4)] group-hover:shadow-[0_0_30px_rgba(57,255,20,0.6)] transition-all"
            >
              <Zap size={22} className="text-black fill-current" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold text-white tracking-tighter group-hover:text-neon-green transition-colors leading-none">
                TaskFlow
              </span>
              <span className="text-[8px] text-white/30 uppercase tracking-[0.4em] mt-1 font-bold">OS V.2.0</span>
            </div>
          </Link>

          {/* Right side controls */}
          <div className="flex items-center gap-3 md:gap-4">
            <LanguageSelector />

            {/* Theme toggle — always works, no lock */}
            <button
              onClick={handleThemeClick}
              title={`Theme: ${themeLabel} — click to switch`}
              className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-white/5 transition-all text-white/60 hover:text-white border border-transparent hover:border-white/10"
            >
              {themeIcon}
              <span className="text-[10px] font-bold uppercase tracking-widest hidden md:inline">{themeLabel}</span>
            </button>

            <div className="h-8 w-px bg-white/10 mx-1 hidden md:block" />

            {user ? (
              <div className="flex items-center gap-3 md:gap-4">
                {/* User info */}
                <div className="hidden lg:flex flex-col text-right items-end">
                  <span className="text-xs font-bold text-white leading-tight flex items-center gap-2">
                    {user.name}
                    <Sparkles size={12} className="text-neon-green" />
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neon-green/60">
                      Active
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-green shadow-neon animate-pulse" />
                  </div>
                </div>

                {/* Help */}
                <button
                  onClick={() => setIsHelpOpen(true)}
                  className="p-2.5 text-white/50 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                  title="Help"
                >
                  <HelpCircle size={18} />
                </button>

                {/* Logout */}
                <button
                  onClick={logout}
                  className="flex items-center gap-2 p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all border border-red-500/20 group"
                  title="Logout"
                >
                  <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
                  <span className="text-xs font-bold hidden sm:inline uppercase tracking-wider">{t('Logout')}</span>
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="px-6 py-2.5 rounded-xl text-sm border border-white/10 text-white/60 hover:text-white hover:bg-white/5 font-bold transition-all uppercase tracking-wider">
                  {t('Login')}
                </Link>
                <Link to="/signup" className="px-6 py-2.5 rounded-xl text-sm bg-neon-green text-black font-bold hover:bg-green-400 transition-all shadow-neon uppercase tracking-wider hidden sm:block">
                  {t('Signup')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
};

export default Navbar;
