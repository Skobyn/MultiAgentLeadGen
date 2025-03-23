import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Integration {
  _id: string;
  name: string;
  type: string;
}

interface TestResult {
  success: boolean;
  message?: string;
}

interface ConnectionTestStepProps {
  selectedIntegrations: string[];
  testResults: Record<string, TestResult>;
  setTestResults: (results: Record<string, TestResult>) => void;
}

const ConnectionTestStep: React.FC<ConnectionTestStepProps> = ({
  selectedIntegrations,
  testResults,
  setTestResults
}) => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState('');
  
  // Fetch selected integrations details
  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        setLoading(true);
        
        // Fetch all integrations
        const response = await axios.get('/api/integrations');
        const allIntegrations = response.data;
        
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

  // Run all connection tests
  const runAllTests = async () => {
    try {
      setTesting(true);
      
      // Call the API endpoint to test all connections
      const response = await axios.post('/api/setup/test-connections');
      
      // Update test results
      setTestResults(response.data.results);
    } catch (err) {
      setError('Failed to test connections');
      console.error(err);
    } finally {
      setTesting(false);
    }
  };

  // Test a single connection
  const testConnection = async (integrationId: string) => {
    try {
      // Update UI to show testing for this integration
      setTestResults({
        ...testResults,
        [integrationId]: { success: false, message: 'Testing...' }
      });
      
      // Call the API endpoint to test this connection
      const response = await axios.post(`/api/integrations/${integrationId}/test`);
      
      // Update test result for this integration
      setTestResults({
        ...testResults,
        [integrationId]: response.data
      });
    } catch (err) {
      setTestResults({
        ...testResults,
        [integrationId]: { 
          success: false, 
          message: 'Error testing connection' 
        }
      });
      console.error(err);
    }
  };

  // Automatically run tests when component mounts
  useEffect(() => {
    if (!loading && Object.keys(testResults).length === 0) {
      runAllTests();
    }
  }, [loading, testResults, setTestResults]);

  // Get status icon based on test result
  const getStatusIcon = (integrationId: string) => {
    const result = testResults[integrationId];
    
    if (!result) {
      return (
        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    
    if (result.message === 'Testing...') {
      return (
        <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      );
    }
    
    if (result.success) {
      return (
        <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    }
    
    return (
      <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading integration details...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Test Connections</h2>
      <p className="mb-6 text-gray-600">
        Testing connections to verify your API credentials are working correctly.
      </p>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <button
          onClick={runAllTests}
          disabled={testing}
          className={`px-4 py-2 rounded ${
            testing
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {testing ? 'Testing...' : 'Test All Connections'}
        </button>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Integration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Message
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {integrations.map(integration => (
              <tr key={integration._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{integration.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {integration.type === 'leadSource'
                      ? 'Lead Source'
                      : integration.type === 'enrichment'
                      ? 'Enrichment Service'
                      : 'Email Service'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(integration._id)}
                    <span className="ml-2 text-sm text-gray-500">
                      {!testResults[integration._id]
                        ? 'Not tested'
                        : testResults[integration._id].message === 'Testing...'
                        ? 'Testing...'
                        : testResults[integration._id].success
                        ? 'Success'
                        : 'Failed'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {testResults[integration._id]?.message || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => testConnection(integration._id)}
                    disabled={testResults[integration._id]?.message === 'Testing...'}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Test
                  </button>
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
              You can still proceed even if some connections fail. You can fix them later in the settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionTestStep;