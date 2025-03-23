import React, { useState, useEffect } from 'react';
import { Integration } from '../../types';
import api from '../../services/api';

// Mock integrations data for development
const MOCK_INTEGRATIONS = [
  {
    _id: 'leadSource_apollo',
    name: 'Apollo',
    type: 'leadSource',
    isEnabled: false,
    isConfigured: false
  },
  {
    _id: 'leadSource_linkedin',
    name: 'LinkedIn',
    type: 'leadSource',
    isEnabled: false,
    isConfigured: false
  },
  {
    _id: 'enrichment_clearbit',
    name: 'Clearbit',
    type: 'enrichment',
    isEnabled: false,
    isConfigured: false
  },
  {
    _id: 'email_sendgrid',
    name: 'SendGrid',
    type: 'email',
    isEnabled: false,
    isConfigured: false
  }
];

interface IntegrationSelectionStepProps {
  selectedIntegrations: string[];
  setSelectedIntegrations: (integrations: string[]) => void;
}

const IntegrationSelectionStep: React.FC<IntegrationSelectionStepProps> = ({
  selectedIntegrations,
  setSelectedIntegrations
}) => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Group integrations by type
  const leadSources = integrations.filter(i => i.type === 'leadSource');
  const enrichmentServices = integrations.filter(i => i.type === 'enrichment');
  const emailServices = integrations.filter(i => i.type === 'email');

  // Fetch available integrations on mount
  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        setLoading(true);
        const data = await api.getIntegrations();
        setIntegrations(data);
        
        // If no integrations are selected yet, automatically select the first ones
        if (selectedIntegrations.length === 0) {
          const initialSelections = [
            data.find((i: Integration) => i.type === 'leadSource')?._id,
            data.find((i: Integration) => i.type === 'enrichment')?._id,
            data.find((i: Integration) => i.type === 'email')?._id
          ].filter(Boolean) as string[];
          
          setSelectedIntegrations(initialSelections);
        }
      } catch (err) {
        setError('Failed to fetch integrations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchIntegrations();
  }, [selectedIntegrations.length, setSelectedIntegrations]);

  // Toggle integration selection
  const toggleIntegration = (id: string) => {
    if (selectedIntegrations.includes(id)) {
      setSelectedIntegrations(selectedIntegrations.filter(i => i !== id));
    } else {
      setSelectedIntegrations([...selectedIntegrations, id]);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading available integrations...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  // Render integration cards grouped by type
  const renderIntegrationGroup = (
    title: string,
    description: string,
    items: Integration[]
  ) => (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(integration => (
          <div
            key={integration._id}
            className={`border rounded-lg p-4 cursor-pointer transition-colors
              ${
                selectedIntegrations.includes(integration._id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            onClick={() => toggleIntegration(integration._id)}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{integration.name}</h4>
                <p className="text-sm text-gray-500">
                  {integration.type === 'leadSource'
                    ? 'Lead Source'
                    : integration.type === 'enrichment'
                    ? 'Enrichment Service'
                    : 'Email Service'}
                </p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedIntegrations.includes(integration._id)}
                  onChange={() => {}} // Change handled by parent div click
                  className="h-5 w-5 text-blue-600"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Select Data Sources & Services</h2>
      <p className="mb-6 text-gray-600">
        Choose which data sources and services you want to integrate with your lead generation system.
        You'll configure API credentials for these in the next step.
      </p>
      
      {renderIntegrationGroup(
        'Lead Sources',
        'Select data sources for generating leads',
        leadSources
      )}
      
      {renderIntegrationGroup(
        'Enrichment Services',
        'Select services for enriching lead data',
        enrichmentServices
      )}
      
      {renderIntegrationGroup(
        'Email Services',
        'Select services for sending emails',
        emailServices
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
              You can always add or remove integrations later from the settings page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationSelectionStep;