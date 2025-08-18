import React from 'react';

interface WizardStepProps {
  step: {
    number: number;
    title: string;
    description: string;
  };
  isActive: boolean;
  isCompleted: boolean;
  isLast?: boolean;
}

const WizardStep: React.FC<WizardStepProps> = ({ step, isActive, isCompleted, isLast = false }) => {
  return (
    <div className="flex items-center">
    <div className="flex flex-col items-center">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all ${
        isCompleted
            ? 'bg-green-500 text-white'
          : isActive
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-600'
      }`}>
        {isCompleted ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        ) : (
            <span className="text-sm font-semibold">{step.number}</span>
        )}
      </div>
        <div className="text-center max-w-32">
          <div className={`text-sm font-medium ${
            isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
      }`}>
        {step.title}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {step.description}
          </div>
        </div>
      </div>
      {!isLast && (
        <div className={`flex-1 h-0.5 mx-4 ${
          isCompleted ? 'bg-green-500' : 'bg-gray-200'
        }`} />
      )}
    </div>
  );
};

export default WizardStep;