import React from 'react';
import { Upload, Settings, Play, CheckCircle } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Upload,
      title: 'Upload Recipients',
      description: 'Upload your recipient list via CSV or connect your database. Support for multiple formats and validation.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Settings,
      title: 'Configure Distribution',
      description: 'Set your token, network, and distribution parameters. Advanced options for gas optimization and scheduling.',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Play,
      title: 'Launch Distribution',
      description: 'Deploy your distribution with one click. Real-time monitoring and automatic retry mechanisms.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: CheckCircle,
      title: 'Monitor & Analyze',
      description: 'Track progress in real-time and analyze performance with comprehensive analytics and reporting.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="py-10 bg-gray-50">
      <div className="max-w-4xl mx-auto px-2 sm:px-3 lg:px-4">
        <div className="text-center mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-2">How Disperzo Works</h2>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">
            Get started with bulk token distributions in just 4 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                <div className={`w-10 h-10 ${step.bgColor} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                  <Icon className={`w-5 h-5 ${step.color}`} />
                </div>
                <div className="text-xs font-medium text-blue-600 mb-1">Step {index + 1}</div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed text-xs">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;