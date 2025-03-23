import React, { useState } from 'react';
import DataSourceSettings from './DataSourceSettings';
import EnrichmentSettings from './EnrichmentSettings';
import APISettings from './APISettings';

enum TabName {
  DataSources = 'dataSources',
  Enrichment = 'enrichment',
  API = 'api'
}

const SettingsTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabName>(TabName.DataSources);

  // Define tabs
  const tabs = [
    { name: TabName.DataSources, label: 'Data Sources', icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ) },
    { name: TabName.Enrichment, label: 'Enrichment', icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ) },
    { name: TabName.API, label: 'API Settings', icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ) }
  ];

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case TabName.DataSources:
        return <DataSourceSettings />;
      case TabName.Enrichment:
        return <EnrichmentSettings />;
      case TabName.API:
        return <APISettings />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="flex flex-col md:flex-row">
        {/* Tabs sidebar */}
        <div className="w-full md:w-64 mb-6 md:mb-0 md:mr-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">Settings</h3>
            </div>
            <nav className="p-2">
              {tabs.map(tab => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 ${
                    activeTab === tab.name
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className={`mr-3 ${
                    activeTab === tab.name ? 'text-blue-500' : 'text-gray-500'
                  }`}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Tab content */}
        <div className="flex-1 bg-white shadow rounded-lg overflow-hidden">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsTabs;