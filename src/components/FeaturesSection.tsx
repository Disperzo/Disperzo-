import React from 'react';
import { Shield, Zap, BarChart3, Globe, Lock, Users } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade security with multi-signature wallets, audit trails, and compliance features.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Process thousands of transactions in minutes with our optimized smart contracts.',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Comprehensive dashboards with detailed insights into your distribution performance.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Globe,
      title: 'Multi-Network Support',
      description: 'Distribute across Ethereum, Polygon, BSC, and 50+ other networks seamlessly.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Lock,
      title: 'Gas Optimization',
      description: 'Intelligent gas management to minimize costs and maximize transaction success rates.',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Role-based access control and team management for enterprise workflows.',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Disperzo?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Built for scale, security, and simplicity. Everything you need for successful token distributions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-md transition-all duration-200 border border-gray-100">
                <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6`}>
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;