import React, { useState } from 'react';
import { TrendingUp, DollarSign, Users, Activity, ArrowUpRight } from 'lucide-react';

const Analytics = () => {
  const [selectedMetric, setSelectedMetric] = useState('volume');

  const analyticsData = {
    overview: {
      totalDistributed: '$2.5M',
      totalRecipients: '15,420',
      activeDistributions: '8',
      successRate: '99.9%',
      totalGasUsed: '0.234 ETH',
      avgGasPrice: '$25.6'
    },
    trends: {
      volume: [120, 190, 300, 500, 200, 300, 450],
      recipients: [50, 80, 120, 200, 150, 180, 220],
      gas: [0.1, 0.15, 0.2, 0.3, 0.25, 0.28, 0.35]
    },
    topTokens: [
      { symbol: 'USDC', amount: '$1,234,567', recipients: 8234, percentage: 48.5, growth: 12.3 },
      { symbol: 'ETH', amount: '$567,890', recipients: 3456, percentage: 22.3, growth: 8.7 },
      { symbol: 'USDT', amount: '$345,678', recipients: 2345, percentage: 13.6, growth: -2.1 }
    ],
    networkPerformance: [
      { network: 'Ethereum', distributions: 45, successRate: 99.8, avgGas: '$28.5', totalVolume: '$1.2M' },
      { network: 'Polygon', distributions: 32, successRate: 99.9, avgGas: '$0.5', totalVolume: '$800K' },
      { network: 'BSC', distributions: 28, successRate: 99.7, avgGas: '$1.2', totalVolume: '$500K' }
    ],
    recentActivity: [
      { id: 1, name: 'Q4 Airdrop Campaign', status: 'completed', amount: '$50,000', recipients: 2500, time: '2 hours ago', network: 'Ethereum' },
      { id: 2, name: 'Team Rewards', status: 'processing', amount: '$25,000', recipients: 150, time: '4 hours ago', network: 'Polygon' },
      { id: 3, name: 'Community Rewards', status: 'completed', amount: '$75,000', recipients: 3000, time: '1 day ago', network: 'Ethereum' }
    ],
    performanceMetrics: {
      avgBatchSize: 85,
      totalBatches: 234,
      failedTransactions: 12,
      retrySuccessRate: 94.2,
      gasOptimization: 23.5
    }
  };

  const getMetricData = () => {
    switch (selectedMetric) {
      case 'volume':
        return analyticsData.trends.volume;
      case 'recipients':
        return analyticsData.trends.recipients;
      case 'gas':
        return analyticsData.trends.gas;
      default:
        return analyticsData.trends.volume;
    }
  };

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case 'volume':
        return 'Volume ($K)';
      case 'recipients':
        return 'Recipients';
      case 'gas':
        return 'Gas Used (ETH)';
      default:
        return 'Volume ($K)';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive insights into your distribution performance</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{analyticsData.overview.totalDistributed}</div>
            <div className="text-sm text-gray-600">Total Distributed</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{analyticsData.overview.totalRecipients}</div>
            <div className="text-sm text-gray-600">Total Recipients</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{analyticsData.overview.activeDistributions}</div>
            <div className="text-sm text-gray-600">Active Distributions</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{analyticsData.overview.successRate}</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
        </div>

        {/* Distribution Trends */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Distribution Trends</h3>
            <div className="flex space-x-2">
              {['volume', 'recipients', 'gas'].map((metric) => (
                <button
                  key={metric}
                  onClick={() => setSelectedMetric(metric)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedMetric === metric
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {metric.charAt(0).toUpperCase() + metric.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {getMetricData().map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                  style={{ height: `${(value / Math.max(...getMetricData())) * 200}px` }}
                ></div>
                <div className="text-xs text-gray-500 mt-2">Day {index + 1}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4 text-sm text-gray-600">{getMetricLabel()}</div>
        </div>

        {/* Network Performance */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Network Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analyticsData.networkPerformance.map((network, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-medium text-gray-900">{network.network}</div>
                  <div className="text-sm text-green-600">{network.successRate}% success</div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Distributions:</span>
                    <span className="font-medium">{network.distributions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Gas:</span>
                    <span className="font-medium">{network.avgGas}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Volume:</span>
                    <span className="font-medium">{network.totalVolume}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Token Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Token Distribution</h3>
          <div className="space-y-4">
            {analyticsData.topTokens.map((token, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="font-semibold text-blue-600">{token.symbol}</span>
              </div>
                  <div>
                    <div className="font-medium text-gray-900">{token.amount}</div>
                    <div className="text-sm text-gray-600">{token.recipients.toLocaleString()} recipients</div>
                  </div>
                    </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{token.percentage}%</div>
                  <div className={`text-sm ${token.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {token.growth >= 0 ? '+' : ''}{token.growth}%
                  </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">{analyticsData.performanceMetrics.avgBatchSize}</div>
              <div className="text-sm text-gray-600">Avg Batch Size</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">{analyticsData.performanceMetrics.totalBatches}</div>
              <div className="text-sm text-gray-600">Total Batches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">{analyticsData.performanceMetrics.failedTransactions}</div>
              <div className="text-sm text-gray-600">Failed Transactions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">{analyticsData.performanceMetrics.retrySuccessRate}%</div>
              <div className="text-sm text-gray-600">Retry Success Rate</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
              View All
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="space-y-4">
            {analyticsData.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">{activity.network.charAt(0)}</span>
                  </div>
                <div>
                    <div className="font-medium text-gray-900">{activity.name}</div>
                    <div className="text-sm text-gray-600">{activity.time} • {activity.recipients} recipients</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">{activity.amount}</div>
                  <div className={`text-sm px-2 py-1 rounded-full ${
                    activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                    activity.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {activity.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;