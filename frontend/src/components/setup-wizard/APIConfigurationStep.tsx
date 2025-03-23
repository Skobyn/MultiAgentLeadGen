import React, { useState, useEffect } from 'react';
import { Integration } from '../../types';
import api from '../../services/api';

interface APIConfigurationStepProps {
  selectedIntegrations: string[];
  apiConfigurations: Record<string, any>;
  setApiConfigurations: (configs: Record<string, any>) => void;
}

const APIConfigurationStep: React.FC<APIConfigurationStepProps> = ({
  selectedIntegrations,
  apiConfigurations,
  setApiConfigurations
}) => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<string | null>(null);
  
  // Fetch selected integrations details
  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        setLoading(true);
        
        // Fetch all integrations
        const allIntegrations = await api.getIntegrations();
        
        // Filter to only selected integrations
        const selectedIntegrationsData = allIntegrations.filter(
          (integration: Integration) => selectedIntegrations.includes(integration._id)
        );
        
        setIntegrations(selectedIntegrationsData);
        
        // Initialize API configurations if empty
        if (Object.keys(apiConfigurations).length === 0) {
          const initialConfigurations: Record<string, any> = {};
          
          selectedIntegrationsData.forEach((integration: Integration) => {
            initialConfigurations[integration._id] = {
              ...integration.credentials
            };
          });
          
          setApiConfigurations(initialConfigurations);
        }
        
        // Set active tab to first integration
        if (selectedIntegrationsData.length > 0 && !activeTab) {
          setActiveTab(selectedIntegrationsData[0]._id);
        }
      } catch (err) {
        setError('Failed to fetch integration details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchIntegrations();
  }, [selectedIntegrations, apiConfigurations, activeTab, setApiConfigurations]);

  // Handle input changes
  const handleInputChange = (integrationId: string, field: string, value: string) => {
    setApiConfigurations({
      ...apiConfigurations,
      [integrationId]: {
        ...apiConfigurations[integrationId],
        [field]: value
      }
    });
  };

  // Get form fields based on integration type
  const getFormFields = (integration: Integration) => {
    switch (integration.type) {
      case 'leadSource':
        return ['apiKey', 'apiSecret'];
      case 'enrichment':
        return ['apiKey'];
      case 'email':
        if (integration.name === 'SMTP') {
          return ['host', 'port', 'username', 'password'];
        }
        return ['apiKey'];
      default:
        return ['apiKey'];
    }
  };

  // Get field label
  const getFieldLabel = (field: string) => {
    const labels: Record<string, string> = {
      apiKey: 'API Key',
      apiSecret: 'API Secret',
      username: 'Username',
      password: 'Password',
      host: 'SMTP Host',
      port: 'SMTP Port',
      url: 'Custom URL'
    };
    
    return labels[field] || field;
  };

  if (loading) {
    return <div className="text-center py-8">Loading integration details...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Configure API Credentials</h2>
      <p className="mb-6 text-gray-600">
        Enter API credentials for each selected integration. These will be securely stored and used for connecting to the services.
      </p>
      
      {integrations.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          No integrations selected. Please go back and select at least one integration.
        </div>
      ) : (
        <div>
          {/* Tabs navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {integrations.map(integration => (
                <button
                  key={integration._id}
                  onClick={() => setActiveTab(integration._id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === integration._id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {integration.name}
                </button>
              ))}
            </nav>
          </div>
          
          {/* Active tab content */}
          {integrations.map(integration => (
            <div
              key={integration._id}
              className={activeTab === integration._id ? 'block' : 'hidden'}
            >
              <h3 className="text-lg font-medium mb-4">{integration.name} Configuration</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-600">
                  {integration.type === 'leadSource'
                    ? `Connect to ${integration.name} to fetch lead data. You'll need an API key from your ${integration.name} account.`
                    : integration.type === 'enrichment'
                    ? `${integration.name} will be used to enrich your lead data with additional information.`
                    : `${integration.name} will be used to send emails to your leads.`}
                </p>
              </div>
              
              <div className="space-y-4">
                {getFormFields(integration).map(field => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {getFieldLabel(field)}
                    </label>
                    <input
                      type={field.toLowerCase().includes('password') ? 'password' : 'text'}
                      value={apiConfigurations[integration._id]?.[field] || ''}
                      onChange={e => handleInputChange(integration._id, field, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`Enter ${getFieldLabel(field)}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0 text-blue-500">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              All API credentials are securely encrypted before being stored in the database.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIConfigurationStep;