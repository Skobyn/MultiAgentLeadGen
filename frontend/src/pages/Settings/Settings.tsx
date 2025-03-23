import React from 'react';
import SettingsTabs from '../../components/settings/SettingsTabs';

const Settings: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      <SettingsTabs />
    </div>
  );
};

export default Settings;