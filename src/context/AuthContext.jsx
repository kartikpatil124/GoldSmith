import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('userInfo');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Validate session on load
  useEffect(() => {
    const verifySession = async () => {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        try {
          const parsed = JSON.parse(userInfo);
          if (parsed && parsed.token) {
            // Check current backend session
            const res = await api.get('/auth/me');
            if (res.success && res.data) {
              // Standardize user object combining token and backend profile
              const updatedUser = { ...parsed, ...res.data };
              setUser(updatedUser);
              localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            }
          }
        } catch (err) {
          console.error('Session validation failed, logging out:', err);
          logout();
        }
      }
    };
    verifySession();
  }, []);

  // Set local storage on user state change
  useEffect(() => {
    if (user) {
      localStorage.setItem('userInfo', JSON.stringify(user));
    } else {
      localStorage.removeItem('userInfo');
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post('/auth/login', { email, password });
      if (res.success && res.data) {
        setUser(res.data);
        return res.data;
      } else {
        const fallbackUser = res.data || res;
        setUser(fallbackUser);
        return fallbackUser;
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post('/auth/register', { name, email, password, phone });
      if (res.success && res.data) {
        setUser(res.data);
        return res.data;
      } else {
        const fallbackUser = res.data || res;
        setUser(fallbackUser);
        return fallbackUser;
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout').catch(() => {});
    } catch (e) {
      console.warn('Backend logout call skipped');
    } finally {
      setUser(null);
      localStorage.removeItem('userInfo');
    }
  };

  // Google Social Sign-In Handler
  const googleLogin = async (payload) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post('/auth/google', payload);
      if (res.success && res.data) {
        setUser(res.data);
        return res.data;
      }
      throw new Error(res.message || 'Google authentication failed');
    } catch (err) {
      setError(err.message || 'Google Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Apple Social Sign-In Handler
  const appleLogin = async (payload) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post('/auth/apple', payload);
      if (res.success && res.data) {
        setUser(res.data);
        return res.data;
      }
      throw new Error(res.message || 'Apple authentication failed');
    } catch (err) {
      setError(err.message || 'Apple Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Admin Specific Authentication Handler
  const adminLogin = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post('/admin/login', { email, password });
      if (res.success && res.data) {
        setUser(res.data);
        return res.data;
      }
      throw new Error(res.message || 'Admin login failed');
    } catch (err) {
      setError(err.message || 'Admin login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Trigger
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      return await api.post('/auth/forgot-password', { email });
    } catch (err) {
      setError(err.message || 'Forgot password request failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reset Password Trigger
  const resetPassword = async (token, password) => {
    try {
      setLoading(true);
      setError(null);
      return await api.post('/auth/reset-password', { token, password });
    } catch (err) {
      setError(err.message || 'Reset password request failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        register,
        logout,
        googleLogin,
        appleLogin,
        adminLogin,
        forgotPassword,
        resetPassword,
        loading,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
