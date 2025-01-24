// @ts-nocheck
import api from './api';

// Description: Login user functionality
// Endpoint: POST /api/auth/login
// Request: { email: string, password: string }
// Response: { accessToken: string, refreshToken: string }
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/api/auth/login', { email, password });

    console.log("Token lengths:", {
      accessTokenLength: response.data.accessToken.length,
      refreshTokenLength: response.data.refreshToken?.length
    });

    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);

    console.log("Stored token lengths:", {
      accessTokenLength: localStorage.getItem('accessToken')?.length,
      refreshTokenLength: localStorage.getItem('refreshToken')?.length
    });

    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Register user functionality
// Endpoint: POST /api/auth/register
// Request: { email: string, password: string }
// Response: { email: string }
export const register = async (email: string, password: string) => {
  try {
    const response = await api.post('/api/auth/register', { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Logout
// Endpoint: POST /api/auth/logout
// Request: {}
// Response: { success: boolean, message: string }
export const logout = async () => {
  try {
    const response = await api.post('/api/auth/logout');
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}; 

// Description: Request password reset
// Endpoint: POST /api/auth/forgot-password
// Request: { email: string }
// Response: { status: string, message: string }
export const forgotPassword = async (email: string) => {
  try {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Reset password with token
// Endpoint: POST /api/auth/reset-password/:token
// Request: { password: string }
// Response: { status: string, accessToken: string, refreshToken: string }
export const resetPassword = async (token: string, password: string) => {
  try {
    const response = await api.post(`/api/auth/reset-password/${token}`, { password });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};
