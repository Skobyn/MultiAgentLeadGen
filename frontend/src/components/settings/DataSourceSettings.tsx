import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Integration, SystemConfiguration } from '../../types';

const DataSourceSettings: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [config, setConfig] = useState<SystemConfiguration>({ 
    defaultDataSources: [],
    defaultEnrichmentServices: [] 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Fetch data sources and system configuration
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all integrations
        const integrationsResponse = await axios.get('/api/integrations');
        
        // Filter to only lead sources
        const leadSources = integrationsResponse.data.filter(
          (integration: Integration) => integration.type === 'leadSource'
        );
        
        setIntegrations(leadSources);
        
        // Fetch system configuration
        const configResponse = await axios.get('/api/settings');
        setConfig(configResponse.data);
      } catch (err) {
        setError('Failed to fetch data source settings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Toggle integration enabled state
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
      setError('Failed to update data source');
      console.error(err);
    }
  };

  // Set as default data source
  const handleSetDefault = async (id: string, isDefault: boolean) => {
    try {
      let updatedDefaults = [...config.defaultDataSources];
      
      if (isDefault) {
        // Add to defaults if not already there
        if (!updatedDefaults.includes(id)) {
          updatedDefaults.push(id);
        }
      } else {
        // Remove from defaults
        updatedDefaults = updatedDefaults.filter(sourceId => sourceId !== id);
      }
      
      // Update configuration on server
      const response = await axios.put('/api/settings', {
        ...config,
        defaultDataSources: updatedDefaults
      });
      
      // Update local state
      setConfig(response.data);
    } catch (err) {
      setError('Failed to update default data sources');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">Loading data source settings...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6">Data Source Settings</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <p className="mb-6 text-gray-600">
        Configure which data sources to use for lead generation. Enable or disable sources and set your default sources.
      </p>
      
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Data Source
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Default
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Enabled
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {integrations.map(integration => (
              <tr key={integration._id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  {integration.name}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
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
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <input
                    type="checkbox"
                    checked={config.defaultDataSources.includes(integration._id)}
                    onChange={e => handleSetDefault(integration._id, e.target.checked)}
                    disabled={!integration.isConfigured}
                    className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                      !integration.isConfigured ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  />
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <label className="inline-flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={integration.isEnabled}
                        onChange={() => handleToggle(integration._id, !integration.isEnabled)}
                        disabled={!integration.isConfigured}
                      />
                      <div className={`w-10 h-5 rounded-full transition ${
                        integration.isEnabled ? 'bg-blue-500' : 'bg-gray-300'
                      } ${!integration.isConfigured ? 'opacity-50' : ''}`}></div>
                      <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition transform ${
                        integration.isEnabled ? 'translate-x-5' : ''
                      }`}></div>
                    </div>
                  </label>
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <a href="/settings/api" className="text-blue-600 hover:text-blue-900">
                    Configure
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0 text-blue-500">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Default data sources are automatically used when creating new lead generation campaigns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSourceSettings;