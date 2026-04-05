import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api/auth';

  useEffect(() => {
    // Check if user is logged in
    try {
      const storedUser = localStorage.getItem('cyberUser');
      if (storedUser && storedUser !== 'undefined') {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Failed to parse stored user', err);
      localStorage.removeItem('cyberUser');
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    if (res.data) {
      localStorage.setItem('cyberUser', JSON.stringify(res.data));
      setUser(res.data);
    }
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await axios.post(`${API_URL}/register`, { name, email, password });
    if (res.data) {
      localStorage.setItem('cyberUser', JSON.stringify(res.data));
      setUser(res.data);
    }
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('cyberUser');
    setUser(null);
  };

  const updatePreferences = async (theme, language) => {
    if (!user) return;
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const res = await axios.put(`${API_URL}/preferences`, { theme, language }, config);
    if(res.data) {
      const updatedUser = { ...user, preferences: res.data.preferences };
      localStorage.setItem('cyberUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updatePreferences, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
