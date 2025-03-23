import React, { useState } from 'react';
import axios from 'axios';

interface ConnectionTesterProps {
  integrationId: string;
  status: string;
  isConfigured: boolean;
  onTestComplete?: (result: { success: boolean; message?: string }) => void;
}

const ConnectionTester: React.FC<ConnectionTesterProps> = ({
  integrationId,
  status,
  isConfigured,
  onTestComplete
}) => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message?: string } | null>(null);
  const [error, setError] = useState('');

  // Test the connection
  const testConnection = async () => {
    try {
      setTesting(true);
      setResult(null);
      setError('');
      
      // Call API to test connection
      const response = await axios.post(`/api/integrations/${integrationId}/test`);
      
      // Update result
      setResult(response.data);
      
      // Call parent callback if provided
      if (onTestComplete) {
        onTestComplete(response.data);
      }
    } catch (err) {
      setError('Failed to test connection');
      setResult({ success: false, message: 'Error testing connection' });
      
      // Call parent callback if provided
      if (onTestComplete) {
        onTestComplete({ success: false, message: 'Error testing connection' });
      }
      
      console.error(err);
    } finally {
      setTesting(false);
    }
  };

  // Get status indicator
  const getStatusIndicator = () => {
    if (testing) {
      return (
        <div className="flex items-center text-blue-500">
          <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Testing...
        </div>
      );
    }
    
    if (!result) {
      return (
        <div className="flex items-center text-gray-500">
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Not tested
        </div>
      );
    }
    
    if (result.success) {
      return (
        <div className="flex items-center text-green-500">
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Connection successful
        </div>
      );
    }
    
    return (
      <div className="flex items-center text-red-500">
        <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        Connection failed
      </div>
    );
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium">Connection Status</h4>
        <div>
          {getStatusIndicator()}
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm mb-4">
          {error}
        </div>
      )}
      
      {result && result.message && (
        <div className={`text-sm mb-4 ${
          result.success ? 'text-green-700' : 'text-red-700'
        }`}>
          {result.message}
        </div>
      )}
      
      <button
        onClick={testConnection}
        disabled={testing || !isConfigured}
        className={`w-full px-4 py-2 rounded-md text-sm font-medium ${
          testing || !isConfigured
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {testing ? 'Testing...' : 'Test Connection'}
      </button>
      
      {!isConfigured && (
        <p className="text-xs text-gray-500 mt-2">
          You need to configure this integration before testing the connection.
        </p>
      )}
    </div>
  );
};

export default ConnectionTester;