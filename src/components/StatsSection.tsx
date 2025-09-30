import React from 'react';
import { DollarSign, Users, Zap, TrendingUp } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: DollarSign,
      value: '$2.5B+',
      label: 'Total Distributed',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Users,
      value: '15M+',
      label: 'Recipients',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Zap,
      value: '99.9%',
      label: 'Success Rate',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: TrendingUp,
      value: '50+',
      label: 'Networks',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="py-10 bg-white">
      <div className="max-w-4xl mx-auto px-2 sm:px-3 lg:px-4">
        <div className="text-center mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Trusted by Leading Projects
          </h2>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">
            Join thousands of projects that rely on Disperzo for their token distribution needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="text-lg font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600 text-xs">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;