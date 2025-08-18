import React from 'react';

interface Stat {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  detail: string;
}

interface StatsCardProps {
  stat: Stat;
}

const StatsCard: React.FC<StatsCardProps> = ({ stat }) => {
  const Icon = stat.icon;
  
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '↗';
      case 'down':
        return '↘';
      default:
        return '→';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50`}>
          <Icon className={`w-6 h-6 text-blue-600`} />
        </div>
        <div className={`text-sm font-medium ${getTrendColor(stat.trend)}`}>
          {getTrendIcon(stat.trend)} {stat.change}
        </div>
      </div>
      
      <div className="mb-2">
        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
        <div className="text-sm text-gray-600">{stat.title}</div>
      </div>
      
      <div className="text-xs text-gray-500">{stat.detail}</div>
    </div>
  );
};

export default StatsCard;