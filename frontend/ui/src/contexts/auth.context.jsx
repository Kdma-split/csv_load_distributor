// // frontend/context/AuthContext.js
// import { createContext, useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// // API URL
// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// // Create context
// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   // Check if user is logged in on initial load
//   useEffect(() => {
//     checkUserLoggedIn();
//   }, []);

//   // Register user
//   const register = async (userData) => {
//     try {
//       const res = await axios.post(`${API_URL}/users/register`, userData, {
//         withCredentials: true
//       });

//       if (res.data.success) {
//         setUser(res.data.user);
//         toast.success('Registration successful');
//         router.push('/dashboard');
//         return true;
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.error || 'Registration failed');
//       return false;
//     }
//   };

//   // Login user
//   const login = async (email, password) => {
//     try {
//       const res = await axios.post(`${API_URL}/users/login`, { email, password }, {
//         withCredentials: true
//       });

//       if (res.data.success) {
//         setUser(res.data.user);
//         toast.success('Login successful');
//         router.push('/dashboard');
//         return true;
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.error || 'Invalid credentials');
//       return false;
//     }
//   };

//   // Logout user
//   const logout = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/users/logout`, {
//         withCredentials: true
//       });

//       if (res.data.success) {
//         setUser(null);
//         toast.success('Logged out successfully');
//         router.push('/');
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.error || 'Logout failed');
//     }
//   };

//   // Check if user is logged in
//   const checkUserLoggedIn = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/users/me`, {
//         withCredentials: true
//       });

//       if (res.data.success) {
//         setUser(res.data.data);
//       } else {
//         setUser(null);
//       }
//     } catch (error) {
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         register,
//         login,
//         logout
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;





// SHORTER

import { createContext, useReducer, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for token expiration on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          dispatch({ type: 'LOGOUT' });
          localStorage.removeItem('token');
        } else {
          const user = {
            id: decoded.id,
            role: decoded.role
          };
          
          dispatch({ 
            type: 'LOGIN_SUCCESS', 
            payload: { user, token } 
          });
        }
      } catch (error) {
        dispatch({ type: 'LOGOUT' });
        localStorage.removeItem('token');
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};