import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/Dashboard.layout.jsx';
import Card from '../../components/ui/Card.jsx';
import Table from '../../components/ui/Table.jsx';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import Alert from '../../components/ui/Alert.jsx';
import { getDistributionSummary } from '../../services/list.service.js';
import { formatDate } from '../../utils/formatters.js';

const DistributionSummary = () => {
  const location = useLocation();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [highlightedBatchId, setHighlightedBatchId] = useState(null);

  useEffect(() => {
    // Check if we're navigating from an upload with a specific batchId to highlight
    if (location.state?.batchId) {
      setHighlightedBatchId(location.state.batchId);
      
      // Clear the highlight after a few seconds
      setTimeout(() => {
        setHighlightedBatchId(null);
      }, 3000);
    }
    
    fetchBatches();
  }, [location.state]);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const data = await getDistributionSummary();
      setBatches(data);
    } catch (err) {
      setError('Failed to load distribution data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && batches.length === 0) {
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
        <h1 className="text-2xl font-bold mb-6 text-gray-800">List Distribution Summary</h1>
        
        {error && <Alert type="error" message={error} className="mb-4" />}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <div className="text-lg font-semibold mb-2">Total Batches</div>
            <div className="text-3xl font-bold text-blue-600">{batches.length}</div>
          </Card>
          
          <Card>
            <div className="text-lg font-semibold mb-2">Total Contacts</div>
            <div className="text-3xl font-bold text-green-600">
              {batches.reduce((sum, batch) => sum + batch.totalItems, 0)}
            </div>
          </Card>
          
          <Card>
            <div className="text-lg font-semibold mb-2">Total Agents</div>
            <div className="text-3xl font-bold text-purple-600">
              {batches.length > 0 ? batches[0].agentCount : 0}
            </div>
          </Card>
        </div>
        
        {batches.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No lists have been uploaded and distributed yet.</p>
            <Button onClick={() => window.location.href = '/lists/upload'}>
              Upload Your First List
            </Button>
          </div>
        ) : (
          <Table 
            columns={[
              { 
                header: 'Batch Name', 
                accessor: 'name',
                cell: ({ value, row }) => (
                  <div className={row.id === highlightedBatchId ? 'bg-yellow-100 p-1 rounded' : ''}>
                    {value}
                  </div>
                )
              },
              { 
                header: 'Upload Date', 
                accessor: 'createdAt',
                cell: ({ value }) => formatDate(value)
              },
              { header: 'Total Contacts', accessor: 'totalItems' },
              { header: 'Agents', accessor: 'agentCount' },
              {
                header: 'Actions',
                accessor: 'id',
                cell: ({ value }) => (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => window.location.href = `/lists/batch/${value}`}
                  >
                    View Details
                  </Button>
                )
              }
            ]}
            data={batches}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default DistributionSummary;