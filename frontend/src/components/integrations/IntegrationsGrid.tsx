import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IntegrationCard from './IntegrationCard';
import APICredentialForm from './APICredentialForm';
import { Integration } from '../../types';

const IntegrationsGrid: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  // Group integrations by type
  const leadSources = integrations.filter(i => i.type === 'leadSource');
  const enrichmentServices = integrations.filter(i => i.type === 'enrichment');
  const emailServices = integrations.filter(i => i.type === 'email');
  
  // Filter integrations based on active filter
  const filteredIntegrations = activeFilter 
    ? integrations.filter(integration => 
        activeFilter === 'configured' 
          ? integration.isConfigured 
          : activeFilter === 'unconfigured' 
          ? !integration.isConfigured 
          : activeFilter === 'active' 
          ? integration.status === 'active' 
          : activeFilter === 'error' 
          ? integration.status === 'error' 
          : true
      )
    : integrations;
  
  // Fetch all integrations
  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/integrations');
        setIntegrations(response.data);
      } catch (err) {
        setError('Failed to fetch integrations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchIntegrations();
  }, []);

  // Handle edit button click
  const handleEdit = (integration: Integration) => {
    setSelectedIntegration(integration);
    setIsFormOpen(true);
  };

  // Handle toggle button click
  const handleToggle = async (id: string, isEnabled: boolean) => {
    try {
      const response = await axios.put(`/api/integrations/${id}/enable`, { isEnabled });
      
      // Update integration in state
      setIntegrations(prevIntegrations => 
        prevIntegrations.map(integration => 
          integration._id === id ? response.data : integration
        )
      );
    } catch (err) {
      setError('Failed to update integration');
      console.error(err);
    }
  };

  // Handle test connection button click
  const handleTest = async (id: string) => {
    try {
      // Find integration and update status to indicate testing
      setIntegrations(prevIntegrations => 
        prevIntegrations.map(integration => 
          integration._id === id 
            ? { ...integration, status: 'testing', errorMessage: null }
            : integration
        )
      );
      
      // Call API to test connection
      const response = await axios.post(`/api/integrations/${id}/test`);
      
      // Find the updated integration
      const updatedIntegration = await axios.get(`/api/integrations/${id}`);
      
      // Update integration in state
      setIntegrations(prevIntegrations => 
        prevIntegrations.map(integration => 
          integration._id === id ? updatedIntegration.data : integration
        )
      );
    } catch (err) {
      setError('Failed to test connection');
      console.error(err);
    }
  };

  // Save credentials from form
  const handleSaveCredentials = async (id: string, credentials: Record<string, string>) => {
    try {
      const response = await axios.put(`/api/integrations/${id}`, { credentials });
      
      // Update integration in state
      setIntegrations(prevIntegrations => 
        prevIntegrations.map(integration => 
          integration._id === id ? response.data : integration
        )
      );
      
      // Close form
      setIsFormOpen(false);
      setSelectedIntegration(null);
    } catch (err) {
      setError('Failed to update credentials');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading integrations...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Integrations</h2>
        
        <div className="flex space-x-2">
          <select
            value={activeFilter || ''}
            onChange={e => setActiveFilter(e.target.value || null)}
            className="border border-gray-300 rounded p-2 text-sm"
          >
            <option value="">All</option>
            <option value="configured">Configured</option>
            <option value="unconfigured">Not Configured</option>
            <option value="active">Active</option>
            <option value="error">Error</option>
          </select>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {/* Render lead sources */}
      <h3 className="text-xl font-semibold mb-4">Lead Sources</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {filteredIntegrations
          .filter(i => i.type === 'leadSource')
          .map(integration => (
            <IntegrationCard
              key={integration._id}
              integration={integration}
              onEdit={handleEdit}
              onToggle={handleToggle}
              onTest={handleTest}
            />
          ))}
      </div>
      
      {/* Render enrichment services */}
      <h3 className="text-xl font-semibold mb-4">Enrichment Services</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {filteredIntegrations
          .filter(i => i.type === 'enrichment')
          .map(integration => (
            <IntegrationCard
              key={integration._id}
              integration={integration}
              onEdit={handleEdit}
              onToggle={handleToggle}
              onTest={handleTest}
            />
          ))}
      </div>
      
      {/* Render email services */}
      <h3 className="text-xl font-semibold mb-4">Email Services</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations
          .filter(i => i.type === 'email')
          .map(integration => (
            <IntegrationCard
              key={integration._id}
              integration={integration}
              onEdit={handleEdit}
              onToggle={handleToggle}
              onTest={handleTest}
            />
          ))}
      </div>
      
      {/* API Credential Form Modal */}
      {isFormOpen && selectedIntegration && (
        <APICredentialForm
          integration={selectedIntegration}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedIntegration(null);
          }}
          onSave={(credentials) => handleSaveCredentials(selectedIntegration._id, credentials)}
        />
      )}
    </div>
  );
};

export default IntegrationsGrid;