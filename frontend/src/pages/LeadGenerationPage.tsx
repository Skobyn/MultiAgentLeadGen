import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Integration, SystemConfiguration } from '../types';

interface LeadGenerationFormData {
  targetAudience: string;
  industryFocus: string;
  companySize: string;
  geographicLocation: string;
  requiredFields: string[];
  leadCount: number;
  dataSourceIds: string[];
  enrichmentServiceIds: string[];
}

const LeadGenerationPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<LeadGenerationFormData>({
    targetAudience: '',
    industryFocus: '',
    companySize: '',
    geographicLocation: '',
    requiredFields: ['email', 'name', 'company'],
    leadCount: 50,
    dataSourceIds: [],
    enrichmentServiceIds: []
  });
  
  const [dataSources, setDataSources] = useState<Integration[]>([]);
  const [enrichmentServices, setEnrichmentServices] = useState<Integration[]>([]);
  const [systemConfig, setSystemConfig] = useState<SystemConfiguration>({
    defaultLeadSources: [],
    defaultEnrichmentServices: []
  });
  
  // Available options for required fields
  const availableFields = [
    { id: 'email', name: 'Email Address' },
    { id: 'name', name: 'Full Name' },
    { id: 'company', name: 'Company Name' },
    { id: 'title', name: 'Job Title' },
    { id: 'phone', name: 'Phone Number' },
    { id: 'linkedin', name: 'LinkedIn URL' },
    { id: 'website', name: 'Website' },
    { id: 'industry', name: 'Industry' },
    { id: 'employeeCount', name: 'Employee Count' },
    { id: 'revenue', name: 'Annual Revenue' },
    { id: 'location', name: 'Business Location' }
  ];
  
  // Fetch integrations and system config on initial load
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all integrations
        const integrationsResponse = await axios.get('/api/integrations');
        const allIntegrations = integrationsResponse.data;
        
        // Filter by type and configured status
        const enabledDataSources = allIntegrations.filter(
          (integration: Integration) => 
            integration.type === 'lead_source' && 
            integration.isConfigured && 
            integration.isEnabled
        );
        
        const enabledEnrichmentServices = allIntegrations.filter(
          (integration: Integration) => 
            integration.type === 'enrichment' && 
            integration.isConfigured && 
            integration.isEnabled
        );
        
        setDataSources(enabledDataSources);
        setEnrichmentServices(enabledEnrichmentServices);
        
        // Fetch system configuration
        const configResponse = await axios.get('/api/settings');
        setSystemConfig(configResponse.data);
        
        // Pre-select defaults
        setFormData(prev => ({
          ...prev,
          dataSourceIds: configResponse.data.defaultLeadSources,
          enrichmentServiceIds: configResponse.data.defaultEnrichmentServices
        }));
        
      } catch (err) {
        setError('Failed to load integrations. Please check your settings and try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle number input changes with validation
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value);
    
    if (!isNaN(numValue) && numValue > 0) {
      setFormData(prev => ({
        ...prev,
        [name]: numValue
      }));
    }
  };
  
  // Handle checkbox groups (required fields)
  const handleFieldCheckbox = (fieldId: string, checked: boolean) => {
    setFormData(prev => {
      if (checked) {
        return {
          ...prev,
          requiredFields: [...prev.requiredFields, fieldId]
        };
      } else {
        return {
          ...prev,
          requiredFields: prev.requiredFields.filter(id => id !== fieldId)
        };
      }
    });
  };
  
  // Handle integration selection checkboxes
  const handleIntegrationCheckbox = (type: 'dataSourceIds' | 'enrichmentServiceIds', id: string, checked: boolean) => {
    setFormData(prev => {
      if (checked) {
        return {
          ...prev,
          [type]: [...prev[type], id]
        };
      } else {
        return {
          ...prev,
          [type]: prev[type].filter(integrationId => integrationId !== id)
        };
      }
    });
  };
  
  // Submit form to generate leads
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (formData.dataSourceIds.length === 0) {
      setError('Please select at least one data source');
      return;
    }
    
    if (formData.targetAudience.trim() === '') {
      setError('Please define your target audience');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // Submit lead generation job
      const response = await axios.post('/api/leads/generate', formData);
      
      // Navigate to job status page
      navigate(`/jobs/${response.data.jobId}`);
      
    } catch (err) {
      setError('Failed to start lead generation job. Please try again.');
      console.error(err);
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      <h1 className="text-3xl font-bold mb-8">Generate Leads</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Target Audience Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Target Audience</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-1">
                Describe your ideal customer profile
              </label>
              <textarea
                id="targetAudience"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleInputChange}
                required
                rows={3}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Example: Decision makers in B2B SaaS companies who need marketing automation solutions"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-2">
              <div>
                <label htmlFor="industryFocus" className="block text-sm font-medium text-gray-700 mb-1">
                  Industry Focus
                </label>
                <input
                  type="text"
                  id="industryFocus"
                  name="industryFocus"
                  value={formData.industryFocus}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Example: SaaS, Fintech, Healthcare"
                />
              </div>
              
              <div>
                <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Size
                </label>
                <select
                  id="companySize"
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="">Any size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1001-5000">1001-5000 employees</option>
                  <option value="5001+">5001+ employees</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="geographicLocation" className="block text-sm font-medium text-gray-700 mb-1">
                  Geographic Location
                </label>
                <input
                  type="text"
                  id="geographicLocation"
                  name="geographicLocation"
                  value={formData.geographicLocation}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Example: United States, Europe, Global"
                />
              </div>
              
              <div>
                <label htmlFor="leadCount" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Leads
                </label>
                <input
                  type="number"
                  id="leadCount"
                  name="leadCount"
                  value={formData.leadCount}
                  onChange={handleNumberChange}
                  min={1}
                  max={1000}
                  required
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Lead Quality & Fields */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Lead Quality & Required Fields</h2>
          <p className="text-sm text-gray-500 mb-4">
            Select the fields you need for each lead. More fields may reduce the total number of leads.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {availableFields.map(field => (
              <div key={field.id} className="flex items-center">
                <input
                  id={`field-${field.id}`}
                  type="checkbox"
                  checked={formData.requiredFields.includes(field.id)}
                  onChange={(e) => handleFieldCheckbox(field.id, e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`field-${field.id}`} className="ml-2 block text-sm text-gray-700">
                  {field.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Data Sources */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Data Sources</h2>
          {dataSources.length === 0 ? (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    No data sources are configured. Please set up data sources in Settings.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {dataSources.map(source => (
                <div key={source._id} className="flex items-center">
                  <input
                    id={`source-${source._id}`}
                    type="checkbox"
                    checked={formData.dataSourceIds.includes(source._id)}
                    onChange={(e) => handleIntegrationCheckbox('dataSourceIds', source._id, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`source-${source._id}`} className="ml-2 block text-sm text-gray-700">
                    {source.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Enrichment Services */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Enrichment Services</h2>
          <p className="text-sm text-gray-500 mb-4">
            Select services to enrich and validate your leads.
          </p>
          
          {enrichmentServices.length === 0 ? (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    No enrichment services are configured. Leads will still be generated, but without additional validation or enrichment.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {enrichmentServices.map(service => (
                <div key={service._id} className="flex items-center">
                  <input
                    id={`service-${service._id}`}
                    type="checkbox"
                    checked={formData.enrichmentServiceIds.includes(service._id)}
                    onChange={(e) => handleIntegrationCheckbox('enrichmentServiceIds', service._id, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`service-${service._id}`} className="ml-2 block text-sm text-gray-700">
                    {service.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Submitting...' : 'Generate Leads'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeadGenerationPage;