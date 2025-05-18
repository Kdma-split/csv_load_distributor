import api from './api.js';

export const uploadList = async (formData) => {
  try {
    const response = await api.post('/api/lists/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
  
export const getDistributionSummary = async () => {
  try {
    const response = await api.get('/api/lists/summary');
    return response.data;
  } catch (error) {
    throw error;
  }
}
  
export const getBatchDetails = async (batchId) => {
  try {
    const response = await api.get(`/api/lists/batch/${batchId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
  
export const getAgentLists = async (agentId) => {
  try {
    const response = await api.get(`/api/lists/agent/${agentId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
