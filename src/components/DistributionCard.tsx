import React from 'react';
import { Clock, CheckCircle, AlertCircle, XCircle, ExternalLink, Network, ArrowRight, RefreshCw } from 'lucide-react';

interface Distribution {
  id: number;
  name: string;
  token: string;
  recipients: number;
  totalAmount: string;
  status: 'completed' | 'processing' | 'pending' | 'failed';
  completedAt?: string;
  scheduledFor?: string;
  txHash?: string;
  progress?: number;
  gasUsed?: string;
  gasPrice?: string;
  network?: string;
  batchSize?: number;
  successRate?: number;
}

interface DistributionCardProps {
  distribution: Distribution;
}

const DistributionCard: React.FC<DistributionCardProps> = ({ distribution }) => {
  const getStatusIcon = () => {
    switch (distribution.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusColor = () => {
    switch (distribution.status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
    }
  };

  const getSuccessRateColor = (rate?: number) => {
    if (!rate) return 'text-gray-500';
    if (rate >= 95) return 'text-green-600';
    if (rate >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{distribution.name}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              {distribution.token}
            </span>
            <span className="flex items-center">
              <Network className="w-3 h-3 mr-1" />
              {distribution.network}
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
              Batch: {distribution.batchSize}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {distribution.status}
          </span>
        </div>
      </div>

      {/* Progress Bar for Processing */}
      {distribution.status === 'processing' && distribution.progress !== undefined && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Processing...</span>
            <span>{distribution.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${distribution.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="text-2xl font-bold text-gray-900">{distribution.totalAmount}</div>
          <div className="text-sm text-gray-600">Total Amount</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="text-2xl font-bold text-gray-900">{distribution.recipients.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Recipients</div>
        </div>
      </div>

      {/* Gas Info */}
      {distribution.gasUsed && distribution.gasPrice && (
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4 p-3 bg-blue-50 rounded-xl">
          <div>
            <span className="font-medium">Gas Used:</span> {distribution.gasUsed}
          </div>
          <div>
            <span className="font-medium">Price:</span> ${distribution.gasPrice}
          </div>
        </div>
      )}

      {/* Success Rate */}
      {distribution.successRate !== undefined && (
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">Success Rate</span>
          <span className={`text-sm font-medium ${getSuccessRateColor(distribution.successRate)}`}>
            {distribution.successRate}% success
          </span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-sm text-gray-500">
          {distribution.status === 'completed' && distribution.completedAt && (
            <span>Completed {formatDate(distribution.completedAt)}</span>
          )}
          {distribution.status === 'pending' && distribution.scheduledFor && (
            <span>Scheduled for {formatDate(distribution.scheduledFor)}</span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {distribution.txHash && (
            <a
              href={`https://etherscan.io/tx/${distribution.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              View TX
            </a>
          )}
          
          {distribution.status === 'failed' && (
            <button className="flex items-center text-red-600 hover:text-red-700 text-sm font-medium">
              <RefreshCw className="w-4 h-4 mr-1" />
              Retry
            </button>
          )}
          
          <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium">
            Details
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DistributionCard;