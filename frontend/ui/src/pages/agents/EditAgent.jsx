import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/Dashboard.layout.jsx';
import AgentForm from '../../components/forms/AgentForm.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import Alert from '../../components/ui/Alert.jsx';
import { getAgentById, updateAgent } from '../../services/agent.service.js';

const EditAgent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        setLoading(true);
        const agentData = await getAgentById(id);
        setAgent(agentData);
      } catch (err) {
        setError('Failed to load agent data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');
      
      const updated = await updateAgent(id, formData);
      
      setSuccess('Agent updated successfully');
      setTimeout(() => {
        navigate('/agents');
      }, 1500);
      
      return updated;
    } catch (err) {
      setError(err.message || 'Failed to update agent');
      return null;
    } finally {
      setLoading(false);
    }
  };

  if (loading && !agent) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Agent</h1>
        
        {error && <Alert type="error" message={error} className="mb-4" />}
        {success && <Alert type="success" message={success} className="mb-4" />}
        
        {agent && (
          <AgentForm 
            initialValues={agent}
            onSubmit={handleSubmit}
            isSubmitting={loading}
            isEditMode={true}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default EditAgent;