// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Input from '../ui/Input.jsx';
// import Button from '../ui/Button.jsx';
// import Alert from '../ui/Alert.jsx';
// import Card from '../ui/Card.jsx';
// import useAuth from '../../hooks/useAuth.js';

// const LoginForm = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [formErrors, setFormErrors] = useState({});
//   const [alert, setAlert] = useState(null);
  
//   const { login, isLoading, error, clearError } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
    
//     // Clear field error when user starts typing
//     if (formErrors[name]) {
//       setFormErrors(prev => ({ ...prev, [name]: '' }));
//     }
    
//     // Clear any previous alert
//     if (alert) {
//       setAlert(null);
//     }
    
//     // Clear auth error
//     if (error) {
//       clearError();
//     }
//   };

//   const validateForm = () => {
//     const errors = {};
//     const { email, password } = formData;
    
//     // Email validation
//     if (!email.trim()) {
//       errors.email = 'Email is required';
//     } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
//       errors.email = 'Please enter a valid email address';
//     }
    
//     // Password validation
//     if (!password) {
//       errors.password = 'Password is required';
//     } else if (password.length < 6) {
//       errors.password = 'Password must be at least 6 characters';
//     }
    
//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }
    
//     const { email, password } = formData;
//     const success = await login(email, password);
    
//     if (success) {
//       navigate('/dashboard');
//     }
//   };

//   return (
//     <Card className="max-w-md mx-auto">
//       <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      
//       {(alert || error) && (
//         <Alert
//           type={alert?.type || 'error'}
//           message={alert?.message || error}
//           onClose={() => {
//             setAlert(null);
//             if (error) clearError();
//           }}
//           className="mb-4"
//         />
//       )}
      
//       <form onSubmit={handleSubmit}>
//         <Input
//           label="Email"
//           type="email"
//           name="email"
//           placeholder="Enter your email"
//           value={formData.email}
//           onChange={handleChange}
//           error={formErrors.email}
//           required
//         />
        
//         <Input
//           label="Password"
//           type="password"
//           name="password"
//           placeholder="Enter your password"
//           value={formData.password}
//           onChange={handleChange}
//           error={formErrors.password}
//           required
//         />
        
//         <Button 
//           type="submit" 
//           className="w-full mt-4" 
//           isLoading={isLoading}
//         >
//           Login
//         </Button>
//       </form>
//     </Card>
//   );
// };

// export default LoginForm;





// SHORTER

// Login.jsx:
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import Card from '../ui/Card.jsx';
import Spinner from '../ui/Spinner.jsx';
import Input from '../ui/Input.jsx';
import useAuth from '../../hooks/useAuth.js';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      setLoading(true);
      const success = await login(email, password);
      
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-8">
      <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
      
      {error && (
        <div className="bg-red-50 text-red-800 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        
        <Button
          type="submit"
          className={`${loading ? "" : "cursor-pointer"} w-full`}
          disabled={loading}
        >
          {loading ? <Spinner size="sm" /> : 'Login'}
        </Button>
      </form>
    </Card>
  );
};

export default LoginForm;


// auth.context.js
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
