import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StepNavigation from './StepNavigation';
import IntegrationSelectionStep from './IntegrationSelectionStep';
import APIConfigurationStep from './APIConfigurationStep';
import ConnectionTestStep from './ConnectionTestStep';
import CompletionStep from './CompletionStep';
import { TestResult } from '../../types';
import api from '../../services/api';

const TOTAL_STEPS = 4;

// Mock API for development if backend is not available
const useMockAPI = true; // Set to false when backend is ready

const WizardContainer: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [setupStatus, setSetupStatus] = useState<{
    setupCompleted: boolean;
    setupStep: number;
  }>({ setupCompleted: false, setupStep: 1 });
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([]);
  const [apiConfigurations, setApiConfigurations] = useState<Record<string, any>>({});
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // Fetch setup status on first load
  useEffect(() => {
    const fetchSetupStatus = async () => {
      try {
        setLoading(true);
        const status = await api.getSetupStatus();
        setSetupStatus(status);
        
        // If setup is already completed, redirect to dashboard
        if (status.setupCompleted) {
          navigate('/');
          return;
        }
        
        // Set current step from server data
        setCurrentStep(status.setupStep || 1);
      } catch (err) {
        setError('Failed to fetch setup status');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSetupStatus();
  }, [navigate]);

  // Initialize setup when starting
  useEffect(() => {
    const initializeSetup = async () => {
      try {
        if (currentStep === 1 && !loading) {
          await api.startSetup();
        }
      } catch (err) {
        setError('Failed to initialize setup');
        console.error(err);
      }
    };
    
    initializeSetup();
  }, [currentStep, loading]);

  const handleNext = async () => {
    try {
      // Save current step progress to server
      if (currentStep === 1) {
        await api.saveSetupStep(currentStep, {
          selectedIntegrations
        });
      } else if (currentStep === 2) {
        await api.saveSetupStep(currentStep, {
          apiConfigurations
        });
      }
      
      // Move to next step
      setCurrentStep(prevStep => {
        const nextStep = prevStep + 1;
        return nextStep <= TOTAL_STEPS ? nextStep : prevStep;
      });
    } catch (err) {
      setError('Failed to save progress');
      console.error(err);
    }
  };

  const handleBack = () => {
    setCurrentStep(prevStep => {
      const prevStepValue = prevStep - 1;
      return prevStepValue >= 1 ? prevStepValue : prevStep;
    });
  };

  const handleComplete = async () => {
    try {
      // Mark setup as complete on the server
      await api.completeSetup({
        defaultDataSources: selectedIntegrations.filter(id => id.includes('leadSource')),
        defaultEnrichmentServices: selectedIntegrations.filter(id => id.includes('enrichment'))
      });
      
      // Redirect to dashboard
      navigate('/');
    } catch (err) {
      setError('Failed to complete setup');
      console.error(err);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <IntegrationSelectionStep
            selectedIntegrations={selectedIntegrations}
            setSelectedIntegrations={setSelectedIntegrations}
          />
        );
      case 2:
        return (
          <APIConfigurationStep
            selectedIntegrations={selectedIntegrations}
            apiConfigurations={apiConfigurations}
            setApiConfigurations={setApiConfigurations}
          />
        );
      case 3:
        return (
          <ConnectionTestStep
            selectedIntegrations={selectedIntegrations}
            testResults={testResults}
            setTestResults={setTestResults}
          />
        );
      case 4:
        return (
          <CompletionStep
            selectedIntegrations={selectedIntegrations}
            testResults={testResults}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Setup Wizard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <StepNavigation
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
      />
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        {renderStep()}
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className={`px-6 py-2 rounded ${
            currentStep === 1
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gray-500 text-white hover:bg-gray-600'
          }`}
        >
          Back
        </button>
        
        {currentStep < TOTAL_STEPS ? (
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleComplete}
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Complete Setup
          </button>
        )}
      </div>
    </div>
  );
};

export default WizardContainer;