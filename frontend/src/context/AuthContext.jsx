import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null); // { userId, firstName, lastName, email, role }
  const [toastMsg, setToastMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          handleLogout('Session expired. Please log in again.');
        } else {
          setIsAuthenticated(true);
          setRole(decoded.role || null);
          // Restore user info from localStorage if available
          const stored = localStorage.getItem('userInfo');
          if (stored) setUser(JSON.parse(stored));
        }
      } catch (err) {
        handleLogout('Invalid session.');
      }
    } else {
      setIsAuthenticated(false);
      setRole(null);
      setUser(null);
    }
  };

  const login = (token, userInfo = null) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    try {
      const decoded = jwtDecode(token);
      setRole(decoded.role || null);
    } catch (err) {
      setRole(null);
    }
    if (userInfo) {
      setUser(userInfo);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
  };

  const handleLogout = (msg = 'Logged out successfully') => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setIsAuthenticated(false);
    setRole(null);
    setUser(null);
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, user, login, logout: () => handleLogout() }}>
      {children}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 bg-[#1e6262] text-white px-6 py-3 rounded-xl shadow-xl z-[100] transition-all transform animate-bounce font-medium text-sm border border-[#2d767f]">
          {toastMsg}
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// chaima: JWT decode and role-based state
