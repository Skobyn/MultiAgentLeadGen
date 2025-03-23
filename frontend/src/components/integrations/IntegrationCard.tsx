import React from 'react';
import { Integration } from '../../types';

interface IntegrationCardProps {
  integration: Integration;
  onEdit: (integration: Integration) => void;
  onToggle: (id: string, isEnabled: boolean) => void;
  onTest: (id: string) => void;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
  integration,
  onEdit,
  onToggle,
  onTest
}) => {
  // Format last tested date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get icon based on integration type
  const getIcon = (type: string) => {
    switch (type) {
      case 'leadSource':
        return (
          <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'enrichment':
        return (
          <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'email':
        return (
          <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };

  // Get status badge based on status
  const getStatusBadge = () => {
    switch (integration.status) {
      case 'active':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Active
          </span>
        );
      case 'error':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Error
          </span>
        );
      case 'unconfigured':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            Not Configured
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`border rounded-lg overflow-hidden shadow-sm 
      ${!integration.isConfigured 
        ? 'border-gray-200 bg-gray-50' 
        : integration.status === 'error' 
        ? 'border-red-200' 
        : 'border-green-200'}`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="mr-3">
              {getIcon(integration.type)}
            </div>
            <div>
              <h3 className="text-lg font-medium">{integration.name}</h3>
              <p className="text-sm text-gray-500">
                {integration.type === 'leadSource'
                  ? 'Lead Source'
                  : integration.type === 'enrichment'
                  ? 'Enrichment Service'
                  : 'Email Service'}
              </p>
            </div>
          </div>
          <div>
            {getStatusBadge()}
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">
              Last tested: {formatDate(integration.lastTested)}
            </p>
            {integration.errorMessage && (
              <p className="text-xs text-red-500 mt-1">{integration.errorMessage}</p>
            )}
          </div>
          <div>
            <label className="inline-flex items-center cursor-pointer">
              <span className="mr-2 text-sm text-gray-500">Enable</span>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={integration.isEnabled}
                  onChange={() => onToggle(integration._id, !integration.isEnabled)}
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
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 flex justify-between">
        <button
          onClick={() => onEdit(integration)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Configure
        </button>
        
        <button
          onClick={() => onTest(integration._id)}
          disabled={!integration.isConfigured}
          className={`text-sm ${
            integration.isConfigured 
              ? 'text-blue-600 hover:text-blue-800' 
              : 'text-gray-400 cursor-not-allowed'
          }`}
        >
          Test Connection
        </button>
      </div>
    </div>
  );
};

export default IntegrationCard;