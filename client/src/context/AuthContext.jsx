import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('mospi_token') || null);
  const [loading, setLoading] = useState(true);

  // Default demo user profile if backend server is warming up or unauthenticated
  const defaultOfficial = {
    id: 'demo_official_id',
    name: 'Rajesh Kumar Verma',
    email: 'official@mospi.gov.in',
    role: 'official',
    designation: 'Statistical Officer',
    department: 'National Accounts Division (NAD)',
    jobRole: 'Statistical Officer',
    qualifications: ['M.Sc. Statistics', 'NSSTA Diploma'],
    workExperienceYears: 5
  };

  useEffect(() => {
    if (token) {
      API.get('/auth/me')
        .then((res) => {
          setUser(res.data.user);
        })
        .catch(() => {
          // Fall back to default demo official if token invalid
          setUser(defaultOfficial);
        })
        .finally(() => setLoading(false));
    } else {
      // Auto-set demo official for frictionless live demo presentation
      setUser(defaultOfficial);
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = res.data;
      localStorage.setItem('mospi_token', newToken);
      setToken(newToken);
      setUser(userData);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Login failed' };
    }
  };

  const register = async (data) => {
    try {
      const res = await API.post('/auth/register', data);
      const { token: newToken, user: userData } = res.data;
      localStorage.setItem('mospi_token', newToken);
      setToken(newToken);
      setUser(userData);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Registration failed' };
    }
  };

  const quickDemoLogin = async (roleType = 'official') => {
    const credentials = roleType === 'admin' 
      ? { email: 'admin@mospi.gov.in', password: 'admin123' }
      : { email: 'official@mospi.gov.in', password: 'password123' };
    
    return await login(credentials.email, credentials.password);
  };

  const logout = () => {
    localStorage.removeItem('mospi_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, quickDemoLogin, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
