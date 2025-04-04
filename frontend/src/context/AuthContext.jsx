'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize authentication state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      console.log('Found stored token, first 10 chars:', storedToken.substring(0, 10));
      setToken(storedToken);
      fetchUserData(storedToken);
    } else {
      console.log('No token found in localStorage');
      setLoading(false);
    }
  }, []);

  // Fetch user data using token
  const fetchUserData = async (authToken) => {
    try {
      console.log('Fetching user data with token:', authToken.substring(0, 10) + '...');
      
      const response = await fetch(`${API_URL}/users/me/`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        console.log('User data fetched successfully:', userData);
        setUser(userData);
      } else {
        console.error('Failed to fetch user data, status:', response.status);
        // Clear invalid token
        localStorage.removeItem('token');
        setToken(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      console.log('Attempting login for user:', username);

      const response = await fetch(`${API_URL}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      const authToken = data.access_token;
      
      console.log('Login successful, token received. First 10 chars:', authToken.substring(0, 10));
      
      // Save token to localStorage
      localStorage.setItem('token', authToken);
      setToken(authToken);
      
      // Fetch user data with the new token
      await fetchUserData(authToken);
      return user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('Logging out, removing token');
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const registerFarmer = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register/farmer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const registerCompany = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register/company`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      logout,
      registerFarmer,
      registerCompany,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 