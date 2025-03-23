import React from 'react';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
}

const StepNavigation: React.FC<StepNavigationProps> = ({ currentStep, totalSteps }) => {
  const steps = [
    { step: 1, label: 'Select Integrations' },
    { step: 2, label: 'Configure APIs' },
    { step: 3, label: 'Test Connections' },
    { step: 4, label: 'Complete Setup' }
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-between">
        {steps.map(step => (
          <div
            key={step.step}
            className="flex flex-col items-center relative"
          >
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full border-2 z-10 
                ${
                  currentStep === step.step
                    ? 'bg-blue-500 text-white border-blue-500'
                    : currentStep > step.step
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-white text-gray-500 border-gray-300'
                }`}
            >
              {currentStep > step.step ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.step
              )}
            </div>
            <div className="text-center mt-2 text-sm">
              <div className={`font-medium ${currentStep === step.step ? 'text-blue-500' : ''}`}>
                {step.label}
              </div>
            </div>
            
            {/* Connect steps with a line */}
            {step.step < totalSteps && (
              <div
                className={`absolute top-5 w-full h-0.5 left-1/2 
                  ${currentStep > step.step ? 'bg-green-500' : 'bg-gray-300'}`}
                style={{ width: 'calc(100% - 2.5rem)' }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepNavigation;