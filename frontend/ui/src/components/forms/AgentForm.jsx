import React, { useState } from 'react';
import Input from '../ui/Input.jsx';
import Button from '../ui/Button.jsx';
import Alert from '../ui/Alert.jsx';
import Card from '../ui/Card.jsx';
import * as agentService from '../../services/agent.service.js';

const AgentForm = ({ onSuccess, initialData = null, isEditing = false }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    mobileNumber: initialData?.mobileNumber || '',
    password: '',
    confirmPassword: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear any previous alert
    if (alert) {
      setAlert(null);
    }
  };

  const validateForm = () => {
    const errors = {};
    const { name, email, mobileNumber, password, confirmPassword } = formData;
    
    if (!name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!mobileNumber.trim()) {
      errors.mobileNumber = 'Mobile number is required';
    } else if (!/^\+[1-9]\d{1,14}$/.test(mobileNumber)) {
      errors.mobileNumber = 'Please enter a valid mobile number with country code (e.g., +1234567890)';
    }
    
    if (!isEditing) {
      if (!password) {
        errors.password = 'Password is required';
      } else if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }
      
      if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    } else if (password && password.length < 6) {
      // If editing and password is provided, validate it
      errors.password = 'Password must be at least 6 characters';
      
      if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { confirmPassword, ...agentData } = formData;
      
      if (isEditing && !agentData.password) {
        delete agentData.password;
      }
      
      let response;
      
      if (isEditing) {
        response = await agentService.updateAgent(initialData._id, agentData);
      } else {
        response = await agentService.createAgent(agentData);
      }
      
      setAlert({
        type: 'success',
        message: isEditing ? 'Agent updated successfully' : 'Agent created successfully'
      });
      
      if (onSuccess) {
        onSuccess(response.data);
      }
      
      if (!isEditing) {
        setFormData({
          name: '',
          email: '',
          mobileNumber: '',
          password: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      const message = error.response?.data?.message || 'An error occurred';
      setAlert({
        type: 'error',
        message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-bold mb-6">
        {isEditing ? 'Edit Agent' : 'Add New Agent'}
      </h2>
      
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
          className="mb-4"
        />
      )}
      
      <form onSubmit={handleSubmit}>
        <Input
          label="Name"
          type="text"
          name="name"
          placeholder="Enter agent name"
          value={formData.name}
          onChange={handleChange}
          error={formErrors.name}
          required
        />
        
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="Enter agent email"
          value={formData.email}
          onChange={handleChange}
          error={formErrors.email}
          required
        />
        
        <Input
          label="Mobile Number"
          type="text"
          name="mobileNumber"
          placeholder="Enter mobile number with country code (e.g., +1234567890)"
          value={formData.mobileNumber}
          onChange={handleChange}
          error={formErrors.mobileNumber}
          required
        />
        
        <Input
          label={isEditing ? "Password (Leave blank to keep current)" : "Password"}
          type="password"
          name="password"
          placeholder={isEditing ? "Enter new password" : "Enter password"}
          value={formData.password}
          onChange={handleChange}
          error={formErrors.password}
          required={!isEditing}
        />
        
        <Input
          label={isEditing ? "Confirm Password" : "Confirm Password"}
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={formErrors.confirmPassword}
          required={!isEditing && formData.password !== ''}
        />
        
        <div className="flex justify-end mt-4">
          <Button 
            type="submit" 
            isLoading={isLoading}
          >
            {isEditing ? 'Update Agent' : 'Create Agent'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AgentForm;