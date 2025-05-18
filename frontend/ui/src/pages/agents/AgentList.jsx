import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/Dashboard.layout.jsx';
import Table from '../../components/ui/Table.jsx';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Modal from '../../components/ui/Modal.jsx';
import { getAgents, deleteAgent } from '../../services/agent.service.js';

const AgentList = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const data = await getAgents();
      setAgents(data);
    } catch (err) {
      setError('Failed to load agents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAgent = () => {
    navigate('/agents/add');
  };

  const handleEditAgent = (id) => {
    navigate(`/agents/edit/${id}`);
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirm({ show: true, id });
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteLoading(true);
      await deleteAgent(deleteConfirm.id);
      
      // Remove from UI
      setAgents(agents.filter(agent => agent.id !== deleteConfirm.id));
      
      // Close modal
      setDeleteConfirm({ show: false, id: null });
    } catch (err) {
      setError('Failed to delete agent');
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirm({ show: false, id: null });
  };

  if (loading && agents.length === 0) {
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Agent Management</h1>
          <Button onClick={handleAddAgent}>Add New Agent</Button>
        </div>
        
        {error && <Alert type="error" message={error} className="mb-4" />}
        
        {agents.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No agents found</p>
            <Button onClick={handleAddAgent}>Add Your First Agent</Button>
          </div>
        ) : (
          <Table 
            columns={[
              { header: 'Name', accessor: 'name' },
              { header: 'Email', accessor: 'email' },
              { header: 'Mobile', accessor: 'mobile' },
              {
                header: 'Actions',
                accessor: 'id',
                cell: ({ value }) => (
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleEditAgent(value)}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="danger" 
                      onClick={() => handleDeleteClick(value)}
                    >
                      Delete
                    </Button>
                  </div>
                )
              }
            ]}
            data={agents}
          />
        )}
      </div>
      
      <Modal 
        isOpen={deleteConfirm.show} 
        onClose={handleCancelDelete}
        title="Confirm Delete"
      >
        <div className="p-4">
          <p className="mb-4">Are you sure you want to delete this agent? This action cannot be undone.</p>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={handleCancelDelete}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={handleConfirmDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? <Spinner size="sm" /> : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default AgentList;