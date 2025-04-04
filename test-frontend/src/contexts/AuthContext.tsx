import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../api/auth.service';
import { User } from '../api/user.service';
import { userService } from '../api/user.service';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  userId: string | null;
  login: (loginOrEmail: string, password: string) => Promise<void>;
  register: (login: string, email: string, password: string) => Promise<string>;
  logout: () => void;
  verifyRegistration: (userId: string, code: string) => Promise<void>;
  initiatePasswordReset: (email: string) => Promise<void>;
  verifyPasswordResetCode: (email: string, code: string) => Promise<void>;
  resetPassword: (email: string, newPassword: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    
    if (token && storedUserId) {
      setIsAuthenticated(true);
      setUserId(storedUserId);
      
      // Load user data
      userService.getUserById(storedUserId)
        .then(userData => {
          setUser(userData);
        })
        .catch(error => {
          console.error('Failed to fetch user data:', error);
          // If token is invalid, log out the user
          if (error.response && error.response.status === 401) {
            logout();
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []);

  const login = async (loginOrEmail: string, password: string) => {
    try {
      setLoading(true);
      const response = await authService.login({ loginOrEmail, password });
      setIsAuthenticated(true);
      setUserId(response.userId);
      
      // Load user data
      const userData = await userService.getUserById(response.userId);
      setUser(userData);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (login: string, email: string, password: string): Promise<string> => {
    try {
      setLoading(true);
      const response = await authService.register({ login, email, password });
      return response.user_id;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    setUserId(null);
  };

  const verifyRegistration = async (userId: string, code: string) => {
    try {
      setLoading(true);
      await authService.verifyRegistration({ userID: userId, code });
    } catch (error) {
      console.error('Verification failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const initiatePasswordReset = async (email: string) => {
    try {
      setLoading(true);
      await authService.initiatePasswordReset({ email });
    } catch (error) {
      console.error('Password reset initiation failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyPasswordResetCode = async (email: string, code: string) => {
    try {
      setLoading(true);
      await authService.verifyPasswordResetCode({ email, code });
    } catch (error) {
      console.error('Reset code verification failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string, newPassword: string) => {
    try {
      setLoading(true);
      await authService.resetPassword({ email, newPassword });
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    user,
    userId,
    login,
    register,
    logout,
    verifyRegistration,
    initiatePasswordReset,
    verifyPasswordResetCode,
    resetPassword,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 