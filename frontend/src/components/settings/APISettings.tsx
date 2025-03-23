import React, { useState, useEffect } from 'react';
import axios from 'axios';
import APICredentialForm from '../integrations/APICredentialForm';
import ConnectionTester from '../integrations/ConnectionTester';
import { Integration } from '../../types';

const APISettings: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
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

  // Save credentials from form
  const handleSaveCredentials = async (credentials: Record<string, string>) => {
    if (!selectedIntegration) return;
    
    try {
      const response = await axios.put(`/api/integrations/${selectedIntegration._id}`, { credentials });
      
      // Update integration in state
      setIntegrations(prevIntegrations => 
        prevIntegrations.map(integration => 
          integration._id === selectedIntegration._id ? response.data : integration
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

  // Update integration on test complete
  const handleTestComplete = async (integrationId: string, result: { success: boolean; message?: string }) => {
    try {
      // Fetch the updated integration
      const response = await axios.get(`/api/integrations/${integrationId}`);
      
      // Update integration in state
      setIntegrations(prevIntegrations => 
        prevIntegrations.map(integration => 
          integration._id === integrationId ? response.data : integration
        )
      );
    } catch (err) {
      console.error('Failed to fetch updated integration:', err);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">Loading API settings...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6">API Credentials</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <p className="mb-6 text-gray-600">
        Manage API credentials for all your integrations in one place. These credentials are securely encrypted.
      </p>
      
      <div className="space-y-6">
        {integrations.map(integration => (
          <div key={integration._id} className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
              <div>
                <h3 className="font-medium">{integration.name}</h3>
                <p className="text-sm text-gray-500">
                  {integration.type === 'leadSource'
                    ? 'Lead Source'
                    : integration.type === 'enrichment'
                    ? 'Enrichment Service'
                    : 'Email Service'}
                </p>
              </div>
              <div>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  integration.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : integration.status === 'error'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {integration.status === 'active'
                    ? 'Active'
                    : integration.status === 'error'
                    ? 'Error'
                    : 'Not Configured'}
                </span>
              </div>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h4 className="font-medium mb-4">API Credentials</h4>
                
                {integration.isConfigured ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-gray-500">
                        Credentials are securely stored
                      </div>
                      <button
                        onClick={() => handleEdit(integration)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Update Credentials
                      </button>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Credentials configured and encrypted
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                      <div className="flex items-center text-sm text-yellow-700">
                        <svg className="h-5 w-5 mr-2 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        No credentials configured
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleEdit(integration)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                    >
                      Configure Credentials
                    </button>
                  </div>
                )}
              </div>
              
              <div>
                <ConnectionTester
                  integrationId={integration._id}
                  status={integration.status}
                  isConfigured={integration.isConfigured}
                  onTestComplete={(result) => handleTestComplete(integration._id, result)}
                />
              </div>
            </div>
          </div>
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
          onSave={handleSaveCredentials}
        />
      )}
    </div>
  );
};

export default APISettings;