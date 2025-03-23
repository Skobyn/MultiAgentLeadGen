// Mock API service for Netlify deployment
import { Integration, TestResult } from '../types';

// Sample integrations data
const integrations: Integration[] = [
  {
    _id: 'leadSource_apollo',
    name: 'Apollo',
    type: 'leadSource',
    isEnabled: false,
    isConfigured: false,
    status: 'unconfigured',
    credentials: {},
    lastTested: new Date()
  },
  {
    _id: 'leadSource_linkedin',
    name: 'LinkedIn',
    type: 'leadSource',
    isEnabled: false,
    isConfigured: false,
    status: 'unconfigured',
    credentials: {},
    lastTested: new Date()
  },
  {
    _id: 'leadSource_crunchbase',
    name: 'Crunchbase',
    type: 'leadSource',
    isEnabled: false,
    isConfigured: false,
    status: 'unconfigured',
    credentials: {},
    lastTested: new Date()
  },
  {
    _id: 'enrichment_clearbit',
    name: 'Clearbit',
    type: 'enrichment',
    isEnabled: false,
    isConfigured: false,
    status: 'unconfigured',
    credentials: {},
    lastTested: new Date()
  },
  {
    _id: 'enrichment_verifier',
    name: 'Million Verifier',
    type: 'enrichment',
    isEnabled: false,
    isConfigured: false,
    status: 'unconfigured',
    credentials: {},
    lastTested: new Date()
  },
  {
    _id: 'email_sendgrid',
    name: 'SendGrid',
    type: 'email',
    isEnabled: false,
    isConfigured: false,
    status: 'unconfigured',
    credentials: {},
    lastTested: new Date()
  },
  {
    _id: 'email_smtp',
    name: 'SMTP',
    type: 'email',
    isEnabled: false,
    isConfigured: false,
    status: 'unconfigured',
    credentials: {},
    lastTested: new Date()
  }
];

// Mock API functions
export const mockApi = {
  getSetupStatus: () => {
    return new Promise<{setupCompleted: boolean; setupStep: number}>((resolve) => {
      setTimeout(() => {
        resolve({ setupCompleted: false, setupStep: 1 });
      }, 500);
    });
  },
  
  startSetup: () => {
    return new Promise<{success: boolean}>((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  },
  
  saveSetupStep: (stepNumber: number, data: any) => {
    return new Promise<{success: boolean}>((resolve) => {
      setTimeout(() => {
        console.log(`Saving step ${stepNumber} data:`, data);
        resolve({ success: true });
      }, 500);
    });
  },
  
  completeSetup: (data: any) => {
    return new Promise<{success: boolean}>((resolve) => {
      setTimeout(() => {
        console.log('Setup completed with data:', data);
        resolve({ success: true });
      }, 500);
    });
  },
  
  getIntegrations: () => {
    return new Promise<Integration[]>((resolve) => {
      setTimeout(() => {
        resolve([...integrations]);
      }, 500);
    });
  },
  
  updateIntegration: (id: string, data: Partial<Integration>) => {
    return new Promise<Integration>((resolve) => {
      setTimeout(() => {
        const integration = integrations.find(i => i._id === id);
        if (integration) {
          Object.assign(integration, data);
        }
        resolve(integration || {} as Integration);
      }, 500);
    });
  },
  
  testConnection: (id: string) => {
    return new Promise<TestResult>((resolve) => {
      setTimeout(() => {
        const random = Math.random();
        if (random > 0.3) {
          resolve({ 
            integrationId: id,
            success: true, 
            message: 'Connection successful!',
            timestamp: new Date()
          });
        } else {
          resolve({ 
            integrationId: id,
            success: false, 
            message: 'Connection failed. Please check your credentials.',
            timestamp: new Date()
          });
        }
      }, 1500);
    });
  }
};

export default mockApi; 