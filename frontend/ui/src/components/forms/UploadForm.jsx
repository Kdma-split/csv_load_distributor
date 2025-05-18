import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';
import Alert from '../ui/Alert.jsx';
import Spinner from '../ui/Spinner.jsx';
import { uploadList } from '../../services/list.service.js';

const UploadForm = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const validateFile = (file) => {
    // Check if file exists
    if (!file) return 'Please select a file';

    // Check file type
    const validTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    if (!validTypes.includes(file.type)) {
      return 'Only CSV, XLSX, and XLS files are allowed';
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return 'File size must be less than 5MB';
    }

    return '';
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate the file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await uploadList(formData);
      
      if (response.success) {
        setSuccess('List uploaded and distributed successfully!');
        setTimeout(() => {
          navigate('/lists/distribution-summary', { 
            state: { batchId: response.batchId } 
          });
        }, 1500);
      } else {
        setError(response.message || 'Failed to upload list');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during upload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload Contact List</h2>
      
      {error && <Alert type="error" message={error} className="mb-4" />}
      {success && <Alert type="success" message={success} className="mb-4" />}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2">Upload File (CSV, XLSX, XLS)</label>
          <Input
            type="file"
            onChange={handleFileChange}
            accept=".csv,.xlsx,.xls"
            className="py-2"
          />
          <p className="text-sm text-gray-500 mt-1">
            File must contain FirstName, Phone, and Notes columns
          </p>
        </div>

        <div className="flex items-center justify-between">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={!file || loading}
          >
            {loading ? <Spinner size="sm" /> : 'Upload & Distribute'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UploadForm;