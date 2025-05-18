import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/Dashboard.layout.jsx';
import UploadForm from '../../components/forms/UploadForm.jsx';

const UploadList = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Upload Contact List</h1>
        <p className="text-gray-600 mb-8">
          Upload your contact list in CSV, XLSX, or XLS format. The system will distribute the contacts
          equally among all agents.
        </p>
        
        <UploadForm />
      </div>
    </DashboardLayout>
  );
};

export default UploadList;