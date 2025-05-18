import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/Dashboard.layout.jsx';
import Card from '../../components/ui/Card.jsx';
import Table from '../../components/ui/Table.jsx';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import Alert from '../../components/ui/Alert.jsx';
import { getBatchDetails } from '../../services/list.service.js';
import { formatDate } from '../../utils/formatters.js';

const BatchDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [batch, setBatch] = useState(null);
  const [agentDistributions, setAgentDistributions] = useState([]);
  const [activeTab, setActiveTab] = useState('summary');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBatchDetails();
  }, [id]);

  const fetchBatchDetails = async () => {
    try {
      setLoading(true);
      const data = await getBatchDetails(id);
      setBatch(data.batch);
      setAgentDistributions(data.distributions);
    } catch (err) {
      setError('Failed to load batch details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/lists/distribution-summary');
  };

  const handleViewAgentItems = (agentId) => {
    setActiveTab(`agent-${agentId}`);
  };

  if (loading && !batch) {
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
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={handleBack} className="mr-4">
            &larr; Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">
            Batch Details: {batch?.name}
          </h1>
        </div>
        
        {error && <Alert type="error" message={error} className="mb-4" />}
        
        {batch && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <div className="text-lg font-semibold mb-2">Upload Date</div>
                <div className="text-xl">{formatDate(batch.createdAt)}</div>
              </Card>
              
              <Card>
                <div className="text-lg font-semibold mb-2">Total Contacts</div>
                <div className="text-xl font-bold text-blue-600">{batch.totalItems}</div>
              </Card>
              
              <Card>
                <div className="text-lg font-semibold mb-2">Agents</div>
                <div className="text-xl font-bold text-green-600">{agentDistributions.length}</div>
              </Card>
            </div>
            
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    className={`py-4 px-6 font-medium text-sm ${
                      activeTab === 'summary'
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('summary')}
                  >
                    Distribution Summary
                  </button>
                  {agentDistributions.map((dist) => (
                    <button
                      key={dist.agentId}
                      className={`py-4 px-6 font-medium text-sm ${
                        activeTab === `agent-${dist.agentId}`
                          ? 'border-b-2 border-blue-500 text-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setActiveTab(`agent-${dist.agentId}`)}
                    >
                      {dist.agentName}
                    </button>
                  ))}
                </nav>
              </div>
              
              <div className="py-6">
                {activeTab === 'summary' ? (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Distribution By Agent</h2>
                    <Table
                      columns={[
                        { header: 'Agent Name', accessor: 'agentName' },
                        { header: 'Email', accessor: 'agentEmail' },
                        { header: 'Contacts Assigned', accessor: 'itemCount' },
                        {
                          header: 'Actions',
                          accessor: 'agentId',
                          cell: ({ value }) => (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewAgentItems(value)}
                            >
                              View Details
                            </Button>
                          )
                        }
                      ]}
                      data={agentDistributions}
                    />
                  </div>
                ) : (
                  agentDistributions.map((dist) => {
                    if (activeTab === `agent-${dist.agentId}`) {
                      return (
                        <div key={dist.agentId}>
                          <h2 className="text-xl font-semibold mb-4">
                            Contacts Assigned to {dist.agentName}
                          </h2>
                          <Table
                            columns={[
                              { header: 'First Name', accessor: 'firstName' },
                              { header: 'Phone', accessor: 'phone' },
                              { header: 'Notes', accessor: 'notes' }
                            ]}
                            data={dist.items || []}
                          />
                        </div>
                      );
                    }
                    return null;
                  })
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BatchDetails;