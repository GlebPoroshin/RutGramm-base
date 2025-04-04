import api from './axios';

export interface RegisterRequest {
  login: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  loginOrEmail: string;
  password: string;
}

export interface VerifyRegistrationRequest {
  userID: string;
  code: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface VerifyPasswordResetRequest {
  email: string;
  code: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

export const authService = {
  register: async (data: RegisterRequest) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest) => {
    const response = await api.post('/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('userId', response.data.userId);
    }
    return response.data;
  },

  verifyRegistration: async (data: VerifyRegistrationRequest) => {
    const response = await api.post('/auth/verify-registration', data);
    return response.data;
  },

  initiatePasswordReset: async (data: PasswordResetRequest) => {
    const response = await api.post('/auth/password-reset', data);
    return response.data;
  },

  verifyPasswordResetCode: async (data: VerifyPasswordResetRequest) => {
    const response = await api.post('/auth/verify-reset-code', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest) => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
  },

  getCurrentUserId: () => {
    return localStorage.getItem('userId');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
}; 