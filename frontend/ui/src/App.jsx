import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/auth.context.jsx';

import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AgentList from './pages/Agents/AgentList.jsx';
import AddAgent from './pages/Agents/AddAgent.jsx';
import EditAgent from './pages/Agents/EditAgent.jsx';
import UploadList from './pages/Lists/UploadList.jsx';
import DistributionSummary from './pages/Lists/DistributionSummary.jsx';
import BatchDetails from './pages/Lists/BatchDetails.jsx';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/agents" 
            element={
              <ProtectedRoute>
                <AgentList />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/agents/add" 
            element={
              <ProtectedRoute>
                <AddAgent />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/agents/edit/:id" 
            element={
              <ProtectedRoute>
                <EditAgent />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/lists/upload" 
            element={
              <ProtectedRoute>
                <UploadList />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/lists/distribution-summary" 
            element={
              <ProtectedRoute>
                <DistributionSummary />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/lists/batch/:id" 
            element={
              <ProtectedRoute>
                <BatchDetails />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;