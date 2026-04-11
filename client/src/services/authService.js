import api from '../api/axiosConfig';

// Sign up - create new account
export const signup = async (name, email, password) => {
  try {
    const response = await api.post('/auth/register', {
      name,
      email,
      password
    });
    // Save token and user data to localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email
      }));
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
    // Save token and user data to localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email
      }));
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
  localStorage.removeItem('user');
};

// Check if user is logged in
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Get current user data
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};