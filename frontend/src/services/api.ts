import axios from 'axios';
import mockApi from './mockApi';
import { Integration } from '../types';

// Determine if we're running on Netlify
const isNetlify = window.location.hostname.includes('netlify.app') || 
                 process.env.REACT_APP_USE_MOCK_API === 'true' ||
                 process.env.NODE_ENV === 'production';

// API service that switches between real API and mock API based on environment
const api = {
  getSetupStatus: async () => {
    if (isNetlify) {
      return await mockApi.getSetupStatus();
    } else {
      const response = await axios.get('/api/setup/status');
      return response.data;
    }
  },
  
  startSetup: async () => {
    if (isNetlify) {
      return await mockApi.startSetup();
    } else {
      const response = await axios.post('/api/setup/start');
      return response.data;
    }
  },
  
  saveSetupStep: async (stepNumber: number, data: any) => {
    if (isNetlify) {
      return await mockApi.saveSetupStep(stepNumber, data);
    } else {
      const response = await axios.post(`/api/setup/step/${stepNumber}`, data);
      return response.data;
    }
  },
  
  completeSetup: async (data: any) => {
    if (isNetlify) {
      return await mockApi.completeSetup(data);
    } else {
      const response = await axios.post('/api/setup/complete', data);
      return response.data;
    }
  },
  
  getIntegrations: async () => {
    if (isNetlify) {
      return await mockApi.getIntegrations();
    } else {
      const response = await axios.get('/api/integrations');
      return response.data;
    }
  },
  
  updateIntegration: async (id: string, data: Partial<Integration>) => {
    if (isNetlify) {
      return await mockApi.updateIntegration(id, data);
    } else {
      const response = await axios.put(`/api/integrations/${id}`, data);
      return response.data;
    }
  },
  
  testConnection: async (id: string) => {
    if (isNetlify) {
      return await mockApi.testConnection(id);
    } else {
      const response = await axios.post(`/api/integrations/${id}/test`);
      return response.data;
    }
  }
};

export default api; 