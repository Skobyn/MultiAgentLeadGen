import React, { useState, useEffect } from 'react';
import { Integration, TestResult } from '../../types';
import api from '../../services/api';

interface CompletionStepProps {
  selectedIntegrations: string[];
  testResults: Record<string, TestResult>;
}

const CompletionStep: React.FC<CompletionStepProps> = ({
  selectedIntegrations,
  testResults
}) => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Count successful connections
  const successfulConnections = Object.values(testResults).filter(
    result => result.success
  ).length;
  
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
      } catch (err) {
        setError('Failed to fetch integration details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchIntegrations();
  }, [selectedIntegrations]);

  // Group integrations by type
  const integrationsByType = integrations.reduce((acc, integration) => {
    const type = integration.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(integration);
    return acc;
  }, {} as Record<string, Integration[]>);

  if (loading) {
    return <div className="text-center py-8">Loading setup summary...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Setup Complete</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-green-800">
              Your lead generation system is ready to use!
            </h3>
            <p className="text-green-700 mt-1">
              You have successfully configured {integrations.length} integrations with {successfulConnections} active connections.
            </p>
          </div>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-4">Setup Summary</h3>
      
      {Object.entries(integrationsByType).map(([type, typeIntegrations]) => (
        <div key={type} className="mb-6">
          <h4 className="text-lg font-medium mb-3">
            {type === 'leadSource'
              ? 'Lead Sources'
              : type === 'enrichment'
              ? 'Enrichment Services'
              : 'Email Services'}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {typeIntegrations.map(integration => {
              const testResult = testResults[integration._id];
              const isSuccessful = testResult && testResult.success;
              
              return (
                <div
                  key={integration._id}
                  className={`border rounded-lg p-4 
                    ${isSuccessful ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-medium">{integration.name}</h5>
                      <p className="text-sm text-gray-500">
                        {isSuccessful ? 'Connected' : 'Connection failed'}
                      </p>
                    </div>
                    <div>
                      {isSuccessful ? (
                        <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                  </div>
                  
                  {testResult && testResult.message && (
                    <p className="mt-2 text-xs text-gray-500">
                      {testResult.message}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
      <div className="mt-8 border-t border-gray-200 pt-6">
        <h3 className="text-xl font-semibold mb-4">Next Steps</h3>
        
        <div className="space-y-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-500 text-white">
                <span>1</span>
              </div>
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-medium">Start generating leads</h4>
              <p className="text-gray-600">
                Use the dashboard to create your first lead generation campaign.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-500 text-white">
                <span>2</span>
              </div>
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-medium">Set up email templates</h4>
              <p className="text-gray-600">
                Create email templates to use with your campaigns.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-500 text-white">
                <span>3</span>
              </div>
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-medium">Fix failed connections</h4>
              <p className="text-gray-600">
                Visit the settings page to fix any failed connections.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletionStep;