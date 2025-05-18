import { useContext } from 'react';
import { AuthContext } from '../contexts/auth.context.jsx';
import api from '../services/api.js';

const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, error, dispatch } = useContext(AuthContext);

  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_REQUEST' });

    try {
      const response = await api.post('/api/users/login', { email, password });
      
      if (response.data.success) {
        const { token } = response.data;
        
        localStorage.setItem('token', token);
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: response.data.user,
            token
          }
        });
        
        return true;
      }
    } catch (error) {
      const message = 
        error.response?.data?.message || 
        'Failed to login. Please check your credentials.';
        
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: message
      });
      
      return false;
    }
  };

  const signup = async (email, password) => {
    dispatch({ type: 'SIGNUP_REQUEST' });

    try {
      const response = await api.post('/api/users/register', { email, password });
      
      if (response.data.success) {
        const { token } = response.data;
        
        localStorage.setItem('token', token);
        
        dispatch({
          type: 'SIGNUP_SUCCESS',
          payload: {
            user: response.data.user,
            token
          }
        });
        
        return true;
      }
    } catch (error) {
      const message = 
        error.response?.data?.message || 
        'Failed to create account. Please try again.';
        
      dispatch({
        type: 'SIGNUP_FAILURE',
        payload: message
      });
      
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.get('/api/users/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const getMe = async () => {
    try {
      const response = await api.get('/api/users/me');
      
      if (response.data.success) {
        return response.data.data;
      }
      
      return null;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    getMe,
    clearError
  };
};

export default useAuth;