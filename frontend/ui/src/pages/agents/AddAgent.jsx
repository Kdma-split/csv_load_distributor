import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/Dashboard.layout.jsx';
import AgentForm from '../../components/forms/AgentForm.jsx';
import Alert from '../../components/ui/Alert.jsx';
import { createAgent } from '../../services/agent.service.js';

const AddAgent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const initialValues = {
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');
      
      const newAgent = await createAgent(formData);
      
      setSuccess('Agent created successfully');
      setTimeout(() => {
        navigate('/agents');
      }, 1500);
      
      return newAgent;
    } catch (err) {
      setError(err.message || 'Failed to create agent');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Add New Agent</h1>
        
        {error && <Alert type="error" message={error} className="mb-4" />}
        {success && <Alert type="success" message={success} className="mb-4" />}
        
        <AgentForm 
          initialValues={initialValues}
          onSubmit={handleSubmit}
          isSubmitting={loading}
          isEditMode={false}
        />
      </div>
    </DashboardLayout>
  );
};

export default AddAgent;