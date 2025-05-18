import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layouts/Dashboard.layout.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Table from '../components/ui/Table.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import Alert from '../components/ui/Alert.jsx';
import useAuth  from '../hooks/useAuth.js';
import { formatDate } from '../utils/formatters.js';
import { getAgents, deleteAgent } from '../services/agent.service.js';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [agents, setAgents] = useState([]);
  const [recentBatches, setRecentBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const agentsData = await getAgents();
        
        // Normally you'd fetch batch data from your API, but since we don't have that service yet
        // I'm using placeholder data
        const batchesData = [
          { id: '1', name: 'May Campaign', uploadDate: new Date(), itemCount: 125, agentCount: 5 },
          { id: '2', name: 'April Leads', uploadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), itemCount: 85, agentCount: 5 }
        ];
        
        setAgents(agentsData);
        setRecentBatches(batchesData);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleAddAgent = () => {
    navigate('/agents/add');
  };

  const handleUploadList = () => {
    navigate('/lists/upload');
  };

  const handleViewAgents = () => {
    navigate('/agents');
  };

  const handleViewBatch = (batchId) => {
    navigate(`/lists/batch/${batchId}`);
  };

  if (loading) {
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
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>
        
        {error && <Alert type="error" message={error} className="mb-6" />}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Agents Overview</h2>
              <Button onClick={handleAddAgent} size="sm">Add Agent</Button>
            </div>
            <div className="flex flex-col">
              <div className="text-4xl font-bold text-blue-600">{agents.length}</div>
              <div className="text-gray-500">Total Agents</div>
            </div>
            <div className="mt-4">
              <Button variant="outline" onClick={handleViewAgents}>View All Agents</Button>
            </div>
          </Card>
          
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">List Distribution</h2>
              <Button onClick={handleUploadList} size="sm">Upload List</Button>
            </div>
            <div className="flex flex-col">
              <div className="text-4xl font-bold text-green-600">{recentBatches.reduce((sum, batch) => sum + batch.itemCount, 0)}</div>
              <div className="text-gray-500">Total Contacts Distributed</div>
            </div>
            <div className="mt-4">
              <Button variant="outline" onClick={() => navigate('/lists/distribution-summary')}>
                View All Batches
              </Button>
            </div>
          </Card>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Batches</h2>
          {recentBatches.length > 0 ? (
            <Table 
              columns={[
                { header: 'Batch Name', accessor: 'name' },
                { 
                  header: 'Upload Date', 
                  accessor: 'uploadDate',
                  cell: ({ value }) => formatDate(value)
                },
                { header: 'Contacts', accessor: 'itemCount' },
                { header: 'Agents', accessor: 'agentCount' },
                {
                  header: 'Actions',
                  accessor: 'id',
                  cell: ({ value }) => (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleViewBatch(value)}
                    >
                      View Details
                    </Button>
                  )
                }
              ]}
              data={recentBatches}
            />
          ) : (
            <p className="text-gray-500">No batches uploaded yet.</p>
          )}
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Agent Summary</h2>
          {agents.length > 0 ? (
            <Table 
              columns={[
                { header: 'Name', accessor: 'name' },
                { header: 'Email', accessor: 'email' },
                { header: 'Phone', accessor: 'mobile' },
                {
                  header: 'Actions',
                  accessor: 'id',
                  cell: ({ value }) => (
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => navigate(`/agents/edit/${value}`)}
                      >
                        Edit
                      </Button>
                    </div>
                  )
                }
              ]}
              data={agents}
            />
          ) : (
            <p className="text-gray-500">No agents added yet.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;