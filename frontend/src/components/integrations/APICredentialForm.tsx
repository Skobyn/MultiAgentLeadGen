import React, { useState, useEffect } from 'react';
import { Integration } from '../../types';

interface APICredentialFormProps {
  integration: Integration;
  onClose: () => void;
  onSave: (credentials: Record<string, string>) => void;
}

const APICredentialForm: React.FC<APICredentialFormProps> = ({
  integration,
  onClose,
  onSave
}) => {
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  
  // Initialize credentials from integration
  useEffect(() => {
    setCredentials({ ...integration.credentials });
  }, [integration]);

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

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setCredentials(prevCredentials => ({
      ...prevCredentials,
      [field]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(credentials);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center bg-gray-100 px-6 py-4 border-b">
          <h3 className="text-lg font-medium">Configure {integration.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              {integration.type === 'leadSource'
                ? `Enter your ${integration.name} API credentials to access lead data.`
                : integration.type === 'enrichment'
                ? `Configure ${integration.name} to enrich your lead data with additional information.`
                : `Set up ${integration.name} to send emails to your leads.`}
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
                  value={credentials[field] || ''}
                  onChange={e => handleInputChange(field, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`Enter ${getFieldLabel(field)}`}
                />
              </div>
            ))}
          </div>
          
          <div className="mt-6 bg-gray-50 p-4 -mx-6 -mb-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default APICredentialForm;