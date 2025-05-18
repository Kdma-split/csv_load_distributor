import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import Card from '../ui/Card.jsx';
import Spinner from '../ui/Spinner.jsx';
import Input from '../ui/Input.jsx';
import useAuth from '../../hooks/useAuth.js';

const SignupForm = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      setLoading(true);
      const success = await signup(email, password);
      
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Failed to create account. Email might already be in use.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-8">
      <h2 className="text-2xl font-bold text-center mb-6">Create Admin Account</h2>
      
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

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
          />
        </div>
        
        <Button
          type="submit"
          className={`${loading ? "" : "cursor-pointer"} w-full`}
          disabled={loading}
        >
          {loading ? <Spinner size="sm" /> : 'Sign Up'}
        </Button>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800">
              Login
            </Link>
          </p>
        </div>
      </form>
    </Card>
  );
};

export default SignupForm;