import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useTranslation } from 'react-i18next';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { user, updatePreferences } = useContext(AuthContext);
  const { i18n } = useTranslation();
  
  // Default values
  const [theme, setTheme] = useState('neon'); // neon, dark, light
  const [language, setLanguage] = useState('en');

  // Load from user preferences or defaults
  useEffect(() => {
    if (user && user.preferences) {
      setTheme(user.preferences.theme || 'neon');
      setLanguage(user.preferences.language || 'en');
      i18n.changeLanguage(user.preferences.language || 'en');
    }
  }, [user, i18n]);

  // Apply theme to html + body
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Reset
    root.classList.remove('theme-neon', 'theme-dark', 'theme-light', 'dark');
    body.removeAttribute('style'); // clear all inline styles first

    if (theme === 'neon') {
      root.classList.add('theme-neon', 'dark');
      body.style.backgroundColor = '#000000';
      body.style.color = '#ffffff';
      body.style.backgroundImage = 'radial-gradient(circle at 50% 50%, rgba(57,255,20,0.05) 0%, transparent 50%), linear-gradient(rgba(57,255,20,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,20,0.02) 1px, transparent 1px)';
      body.style.backgroundSize = '100% 100%, 40px 40px, 40px 40px';
    } else if (theme === 'dark') {
      root.classList.add('theme-dark', 'dark');
      body.style.backgroundColor = '#0a0a0a';
      body.style.color = '#ffffff';
    } else {
      // Light
      root.classList.add('theme-light');
      body.style.backgroundColor = '#f0f4f8';
      body.style.color = '#0f172a';
    }
  }, [theme]);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    if(user && updatePreferences) updatePreferences(newTheme, language);
  };

  const changeLanguage = (newLang) => {
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
    if(user && updatePreferences) updatePreferences(theme, newLang);
  }

  return (
    <ThemeContext.Provider value={{ theme, changeTheme, language, changeLanguage }}>
      {children}
    </ThemeContext.Provider>
  );
};

