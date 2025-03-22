import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  AdjustmentsHorizontalIcon,
  DocumentTextIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';

// Sample data sources
const dataSources = [
  { id: 'apollo', name: 'Apollo', icon: '🚀', active: true },
  { id: 'linkedin', name: 'LinkedIn', icon: '🔗', active: true },
  { id: 'crunchbase', name: 'Crunchbase', icon: '📊', active: true },
  { id: 'zoominfo', name: 'ZoomInfo', icon: '🔍', active: false },
  { id: 'clearbit', name: 'Clearbit', icon: '🔮', active: true },
  { id: 'apify', name: 'Apify', icon: '🤖', active: false },
  { id: 'events', name: 'Event Platforms', icon: '📅', active: false },
  { id: 'social', name: 'Social Media', icon: '👥', active: false },
  { id: 'custom', name: 'Custom APIs', icon: '⚙️', active: false },
];

// Sample lead fields
const leadFields = [
  { id: 'firstName', name: 'First Name', required: true },
  { id: 'lastName', name: 'Last Name', required: true },
  { id: 'email', name: 'Email', required: true },
  { id: 'company', name: 'Company', required: true },
  { id: 'title', name: 'Job Title', required: true },
  { id: 'phone', name: 'Phone', required: false },
  { id: 'location', name: 'Location', required: false },
  { id: 'linkedin', name: 'LinkedIn URL', required: false },
  { id: 'industry', name: 'Industry', required: false },
  { id: 'companySize', name: 'Company Size', required: false },
  { id: 'revenue', name: 'Revenue', required: false },
  { id: 'funding', name: 'Funding', required: false },
];

// Sample enrichment options
const enrichmentOptions = [
  { id: 'emailVerification', name: 'Email Verification', active: true, source: 'Million Verifier API' },
  { id: 'linkedinData', name: 'LinkedIn Profile Data', active: true, source: 'EXA API' },
  { id: 'companyInfo', name: 'Company Information', active: true, source: 'Clearbit' },
  { id: 'personalization', name: 'AI Personalization', active: true, source: 'OpenAI API' },
  { id: 'socialProfiles', name: 'Social Media Profiles', active: false, source: 'Various APIs' },
];

// Sample advanced query
const sampleJsonQuery = `{
  "sources": ["apollo", "linkedin", "crunchbase"],
  "filters": {
    "jobTitle": {
      "includes": ["CTO", "Chief Technology Officer", "VP of Engineering"],
      "excludes": ["Assistant", "Associate"]
    },
    "company": {
      "size": {
        "min": 50,
        "max": 1000
      },
      "industry": ["SaaS", "FinTech", "Healthcare IT"],
      "funding": {
        "min": 5000000,
        "max": 50000000
      }
    },
    "location": {
      "countries": ["United States", "Canada"],
      "cities": ["San Francisco", "New York", "Boston", "Toronto"]
    }
  },
  "enrichment": ["emailVerification", "linkedinData", "personalization"],
  "limit": 200
}`;

const LeadGeneration: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  // Sample lead preview data
  const previewLeads = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      company: 'TechCorp',
      title: 'CTO',
      verified: true,
      source: 'Apollo',
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@techfirm.io',
      company: 'TechFirm',
      title: 'VP of Engineering',
      verified: true,
      source: 'LinkedIn',
    },
    {
      id: 3,
      firstName: 'Michael',
      lastName: 'Johnson',
      email: 'michael.j@healthtech.co',
      company: 'HealthTech',
      title: 'Chief Technology Officer',
      verified: false,
      source: 'Crunchbase',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Lead Generation</h1>
        <p className="mt-1 text-sm text-gray-500">
          Define criteria, select data sources, and generate high-quality leads
        </p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Tab.Group onChange={setSelectedTab}>
          <Tab.List className="flex p-1 bg-gray-50 border-b">
            <Tab
              className={({ selected }) =>
                `w-full py-2.5 text-sm font-medium leading-5 text-primary-700 rounded-t-lg
                ${
                  selected
                    ? 'bg-white shadow'
                    : 'text-gray-500 hover:text-primary-700'
                }`
              }
            >
              <div className="flex items-center justify-center">
                <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                Visual Builder
              </div>
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full py-2.5 text-sm font-medium leading-5 text-primary-700 rounded-t-lg
                ${
                  selected
                    ? 'bg-white shadow'
                    : 'text-gray-500 hover:text-primary-700'
                }`
              }
            >
              <div className="flex items-center justify-center">
                <CodeBracketIcon className="w-5 h-5 mr-2" />
                JSON Query
              </div>
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full py-2.5 text-sm font-medium leading-5 text-primary-700 rounded-t-lg
                ${
                  selected
                    ? 'bg-white shadow'
                    : 'text-gray-500 hover:text-primary-700'
                }`
              }
            >
              <div className="flex items-center justify-center">
                <AdjustmentsHorizontalIcon className="w-5 h-5 mr-2" />
                Configuration
              </div>
            </Tab>
          </Tab.List>
          <Tab.Panels>
            {/* Visual Builder Panel */}
            <Tab.Panel>
              <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Search Criteria */}
                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Search Criteria
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
                          Job Title
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            type="text"
                            name="jobTitle"
                            id="jobTitle"
                            className="form-input block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            placeholder="CTO, VP of Engineering, etc."
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                          Company
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            type="text"
                            name="company"
                            id="company"
                            className="form-input block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            placeholder="Company name or industry"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                          Location
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            type="text"
                            name="location"
                            id="location"
                            className="form-input block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            placeholder="City, state, or country"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="companySize" className="block text-sm font-medium text-gray-700">
                            Company Size
                          </label>
                          <select
                            id="companySize"
                            name="companySize"
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                          >
                            <option>Any size</option>
                            <option>1-10</option>
                            <option>11-50</option>
                            <option>51-200</option>
                            <option>201-500</option>
                            <option>501-1,000</option>
                            <option>1,001-5,000</option>
                            <option>5,000+</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                            Industry
                          </label>
                          <select
                            id="industry"
                            name="industry"
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                          >
                            <option>All industries</option>
                            <option>SaaS</option>
                            <option>FinTech</option>
                            <option>Healthcare</option>
                            <option>E-commerce</option>
                            <option>Education</option>
                            <option>Manufacturing</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" />
                        Add Filter
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <MagnifyingGlassIcon className="-ml-0.5 mr-2 h-4 w-4" />
                        Search
                      </button>
                    </div>
                  </div>

                  {/* Data Preview */}
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Lead Preview
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800">
                        Showing 3 of 200+ results
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Name
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Company
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Title
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Email
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Source
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {previewLeads.map((lead) => (
                            <tr key={lead.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {lead.firstName} {lead.lastName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {lead.company}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {lead.title}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-center">
                                  {lead.email}
                                  {lead.verified && (
                                    <span className="ml-1 text-green-500">✓</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {lead.source}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Generate Full List
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sidebar with Data Sources & Enrichment */}
                <div className="space-y-6">
                  {/* Data Sources */}
                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Data Sources
                    </h3>
                    <div className="space-y-3">
                      {dataSources.map((source) => (
                        <div
                          key={source.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <span className="mr-2">{source.icon}</span>
                            <span className="text-sm text-gray-700">
                              {source.name}
                            </span>
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              id={`source-${source.id}`}
                              name={`source-${source.id}`}
                              defaultChecked={source.active}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Enrichment Options */}
                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Enrichment Options
                    </h3>
                    <div className="space-y-3">
                      {enrichmentOptions.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <div className="text-sm text-gray-700">
                              {option.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              via {option.source}
                            </div>
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              id={`option-${option.id}`}
                              name={`option-${option.id}`}
                              defaultChecked={option.active}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Tab.Panel>

            {/* JSON Query Panel */}
            <Tab.Panel>
              <div className="p-4">
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      JSON Query Editor
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <DocumentTextIcon className="-ml-0.5 mr-1 h-4 w-4" />
                        Load Template
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <MagnifyingGlassIcon className="-ml-0.5 mr-1 h-4 w-4" />
                        Execute Query
                      </button>
                    </div>
                  </div>
                  <div className="rounded-md bg-gray-50 p-4 overflow-auto">
                    <pre className="text-sm">{sampleJsonQuery}</pre>
                  </div>
                  <div className="mt-4">
                    <textarea
                      rows={15}
                      className="form-input block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm font-mono"
                      defaultValue={sampleJsonQuery}
                    />
                  </div>
                </div>
              </div>
            </Tab.Panel>

            {/* Configuration Panel */}
            <Tab.Panel>
              <div className="p-4">
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Lead Fields Configuration
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {leadFields.map((field) => (
                      <div
                        key={field.id}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                      >
                        <div>
                          <label
                            htmlFor={`field-${field.id}`}
                            className="flex items-center"
                          >
                            <span className="text-sm text-gray-700">
                              {field.name}
                            </span>
                            {field.required && (
                              <span className="ml-1 text-red-500 text-xs">*</span>
                            )}
                          </label>
                        </div>
                        <div>
                          <input
                            type="checkbox"
                            id={`field-${field.id}`}
                            name={`field-${field.id}`}
                            defaultChecked={true}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default LeadGeneration;