'use client';

import { createContext, useContext, useState, useEffect } from 'react';

/**
 * Authentication context implementation using React Context API
 * Creates a centralized state management system for user authentication
 */
const AuthContext = createContext();
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function AuthProvider({ children }) {
  // State management with React hooks
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Effect hook to initialize authentication state
   * Implements token persistence using browser localStorage
   * Executes once on component mount
   */
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

  /**
   * Fetches user profile data using JWT authentication
   * Implements proper error handling and token validation
   * @param {string} authToken - JWT token for API authentication
   */
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
        // Invalidate compromised authentication state
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

  /**
   * Authenticates user using username/password credentials
   * Implements JWT token acquisition and storage
   * @param {string} username - User identifier
   * @param {string} password - User authentication credential
   * @returns {Promise<object>} User data on successful authentication
   */
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
      
      // Persist authentication state
      localStorage.setItem('token', authToken);
      setToken(authToken);
      
      // Initialize user data
      await fetchUserData(authToken);
      return user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  /**
   * Terminates user session and clears authentication state
   * Implements complete state purge for security
   */
  const logout = () => {
    console.log('Logging out, removing token');
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  /**
   * Registers a new farmer account with the system
   * @param {object} userData - Farmer registration data
   * @returns {Promise<object>} Registration confirmation
   */
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

  /**
   * Registers a new company account with the system
   * @param {object} userData - Company registration data
   * @returns {Promise<object>} Registration confirmation
   */
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

/**
 * Custom hook for consuming auth context
 * Implements proper context validation pattern
 * @returns {object} Authentication context values and methods
 * @throws {Error} When used outside of AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 