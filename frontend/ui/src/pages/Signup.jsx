import React from 'react';
import { useNavigate } from 'react-router-dom';
import SignupForm from '../components/forms/SignupForm.jsx';

const Signup = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  );
};

export default Signup;