import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Download, Search, Clock, CheckCircle, AlertCircle, ArrowUpRight, TrendingUp } from 'lucide-react';
import DistributionCard from '../components/DistributionCard';
import StatsCard from '../components/StatsCard';
// import KYCBanner from '../components/KYCBanner';
import BalanceCard from '../components/BalanceCard';
import ActionButtons from '../components/ActionButtons';
import TransactionSection from '../components/TransactionSection';
import { useChain } from '../contexts/ChainContext';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [timeRange, setTimeRange] = useState('30d');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showVerificationInfo, setShowVerificationInfo] = useState(false);
  const { selectedChain } = useChain();

  // Enhanced distributions data with more CopperX-like features
  const distributions = [
    {
      id: 1,
      name: 'Q4 Airdrop Campaign',
      token: 'USDC',
      recipients: 2500,
      totalAmount: '50,000',
      status: 'completed' as const,
      completedAt: '2024-01-15T10:30:00Z',
      txHash: '0x1234...5678',
      gasUsed: '0.0234',
      gasPrice: '25',
      network: 'Ethereum',
      batchSize: 100,
      successRate: 99.8
    },
    {
      id: 2,
      name: 'Team Rewards Distribution',
      token: 'ETH',
      recipients: 150,
      totalAmount: '25.5',
      status: 'processing' as const,
      progress: 65,
      gasUsed: '0.0156',
      gasPrice: '22',
      network: 'Polygon',
      batchSize: 50,
      successRate: 100
    },
    {
      id: 3,
      name: 'Staking Rewards Jan',
      token: 'TOKEN',
      recipients: 1200,
      totalAmount: '100,000',
      status: 'pending' as const,
      scheduledFor: '2024-01-20T12:00:00Z',
      gasUsed: '0.0000',
      gasPrice: '0',
      network: 'BSC',
      batchSize: 75,
      successRate: 0
    },
    {
      id: 4,
      name: 'Community Rewards',
      token: 'USDT',
      recipients: 3000,
      totalAmount: '75,000',
      status: 'completed' as const,
      completedAt: '2024-01-14T15:45:00Z',
      txHash: '0xabcd...efgh',
      gasUsed: '0.0345',
      gasPrice: '28',
      network: 'Ethereum',
      batchSize: 120,
      successRate: 99.9
    },
    {
      id: 5,
      name: 'Developer Bounties',
      token: 'DAI',
      recipients: 85,
      totalAmount: '12,500',
      status: 'failed' as const,
      completedAt: '2024-01-13T09:20:00Z',
      txHash: '0xfail...1234',
      gasUsed: '0.0123',
      gasPrice: '30',
      network: 'Ethereum',
      batchSize: 25,
      successRate: 45.2
    }
  ];

  // Enhanced stats with real-time calculations
  const stats = [
    {
      title: 'Total Distributed',
      value: '$2.5M',
      change: '+12.5%',
      trend: 'up' as const,
      icon: ArrowUpRight,
      color: 'text-blue-600',
      detail: 'Last 30 days'
    },
    {
      title: 'Active Campaigns',
      value: '8',
      change: '+2',
      trend: 'up' as const,
      icon: Clock,
      color: 'text-blue-600',
      detail: 'Currently running'
    },
    {
      title: 'Total Recipients',
      value: '15,420',
      change: '+8.2%',
      trend: 'up' as const,
      icon: CheckCircle,
      color: 'text-blue-600',
      detail: 'Unique addresses'
    },
    {
      title: 'Success Rate',
      value: '99.9%',
      change: '0.0%',
      trend: 'stable' as const,
      icon: CheckCircle,
      color: 'text-blue-600',
      detail: 'Average across all'
    }
  ];

  // Network statistics - filtered by selected chain
  const getNetworkStats = () => {
    const chainDistributions = distributions.filter(dist => 
      dist.network.toLowerCase() === selectedChain
    );
    
    const totalAmount = chainDistributions.reduce((sum, dist) => {
      const amount = parseFloat(dist.totalAmount.replace(',', ''));
      return sum + amount;
    }, 0);
    
    const avgSuccessRate = chainDistributions.length > 0 
      ? chainDistributions.reduce((sum, dist) => sum + dist.successRate, 0) / chainDistributions.length
      : 0;

    return [
      { 
        network: selectedChain.charAt(0).toUpperCase() + selectedChain.slice(1), 
        distributions: chainDistributions.length, 
        totalAmount: `$${(totalAmount / 1000).toFixed(1)}K`, 
        successRate: avgSuccessRate.toFixed(1) 
      }
    ];
  };

  const filteredDistributions = distributions.filter(dist => {
    const matchesSearch = dist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dist.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dist.network.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || dist.status === filterStatus;
    const matchesChain = dist.network.toLowerCase() === selectedChain;
    return matchesSearch && matchesFilter && matchesChain;
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      // Update progress for processing distributions
      // This would normally come from WebSocket or API polling
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-2 sm:px-3 lg:px-4 py-5">
        {/* KYC Banner */}
        {/* <KYCBanner /> */}

        {/* Verification Info Link */}
        <div className="text-center mb-4">
          <button
            onClick={() => setShowVerificationInfo(!showVerificationInfo)}
            className="text-blue-600 hover:text-blue-700 text-xs font-medium"
          >
            See what you can do without Verification?
          </button>
        </div>

        {/* Balance Card */}
        <BalanceCard />

        {/* Action Buttons */}
        <ActionButtons />

        {/* Transaction Section */}
        <TransactionSection />

        {/* Advanced Dashboard Section (for verified users) */}
        {showVerificationInfo && (
          <div className="mt-12">
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Dashboard</h1>
                  <p className="text-gray-600">Monitor your payout distributions and track performance</p>
                </div>
                <div className="mt-4 sm:mt-0 flex gap-3">
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                    <option value="1y">Last year</option>
                  </select>
                  <Link
                    to="/distribute"
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors inline-flex items-center"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    New Distribution
                  </Link>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <StatsCard key={index} stat={stat} />
              ))}
            </div>

            {/* Network Overview */}
            <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Network Performance</h3>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Real-time</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {getNetworkStats().map((network, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div className="text-gray-900 font-medium">{network.network}</div>
                      <div className="text-sm text-gray-600">{network.distributions} distributions</div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-900 font-medium">{network.totalAmount}</div>
                      <div className="text-sm text-blue-600">{network.successRate}% success</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-100">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search distributions, tokens, or networks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="processing">Processing</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                  <button 
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {viewMode === 'grid' ? 'List' : 'Grid'}
                  </button>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Distributions List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Recent Distributions</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Showing {filteredDistributions.length} of {distributions.filter(d => d.network.toLowerCase() === selectedChain).length} distributions on {selectedChain.charAt(0).toUpperCase() + selectedChain.slice(1)}
                  </p>
                </div>
                <Link
                  to="/analytics"
                  className="text-blue-600 hover:text-blue-700 transition-colors flex items-center"
                >
                  View All Analytics
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              {filteredDistributions.length > 0 ? (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-6'}>
                  {filteredDistributions.map((distribution) => (
                    <DistributionCard key={distribution.id} distribution={distribution} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                  <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No distributions found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || filterStatus !== 'all' 
                      ? 'Try adjusting your search or filter criteria'
                      : `No distributions found on ${selectedChain.charAt(0).toUpperCase() + selectedChain.slice(1)}`
                    }
                  </p>
                  {!searchTerm && filterStatus === 'all' && (
                    <Link
                      to="/distribute"
                      className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors inline-flex items-center"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Create Distribution
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;