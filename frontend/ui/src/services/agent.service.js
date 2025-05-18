import api from './api.js';

export const createAgent = async (agentData) => {
  try {
    const response = await api.post('/api/agents', agentData);
    return response.data;
  } catch (error) {
    throw error;
  }
}
  
export const getAgents = async () => {
  try {
    const response = await api.get('/api/agents');
    return response.data;
  } catch (error) {
    throw error;
  }
}
  
export const getAgentById = async (agentId) => {
  try {
    const response = await api.get(`/api/agents/${agentId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
  
export const updateAgent = async (agentId, agentData) => {
  try {
    const response = await api.put(`/api/agents/${agentId}`, agentData);
    return response.data;
  } catch (error) {
    throw error;
  }
}
  
export const deleteAgent = async (agentId) => {
  try {
    const response = await api.delete(`/api/agents/${agentId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
