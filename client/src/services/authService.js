import api from '../api/axiosConfig';

// Sign up - create new account
export const signup = async (name, email, password) => {
  try {
    const response = await api.post('/auth/register', {
      name,
      email,
      password
    });
    // Save token to localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

// Sign in - login with existing account
export const signin = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password
    });
    // Save token to localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Signin error:', error);
    throw error;
  }
};

// Sign out - logout
export const signout = () => {
  localStorage.removeItem('token');
};

// Check if user is logged in
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};