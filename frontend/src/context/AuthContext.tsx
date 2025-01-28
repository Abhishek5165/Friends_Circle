import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_URL=import.meta.env.MODE === "development" ? 
"http://localhost:5000/api/auth" : "/api/auth";

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token on page load
      axios
        .get(`${API_URL}/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data.user); // Set the user data from response
          setIsAuthenticated(true);   // Update the authentication state
        })
        .catch((error) => {
          console.error('Token verification failed:', error.response?.data || error.message);
          localStorage.removeItem('token'); // Clear invalid token
        })
        .finally(() => {
          setLoading(false); // Set loading to false after verification
        });
    } else {
      setLoading(false); // No token, stop loading
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token); // Save token to localStorage
      setUser(response.data.user); // Set user data
      setIsAuthenticated(true);   // Set authentication state
    } catch (error) {
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        name,
        email,
        password,
      });
      localStorage.setItem('token', response.data.token); // Save token to localStorage
      setUser(response.data.user); // Set user data
      setIsAuthenticated(true);   // Set authentication state
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token'); // Clear token from localStorage
    setUser(null); // Clear user data
    setIsAuthenticated(false); // Reset authentication state
  };

  if (loading) {
    return <div>Loading...</div>; // Show loader until token verification is complete
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
