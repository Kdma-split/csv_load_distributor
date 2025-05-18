import React from 'react';
import LoginForm from '../components/forms/LoginForm.jsx';

const Login = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            List Distribution App
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your admin account
          </p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;