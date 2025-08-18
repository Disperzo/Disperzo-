import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle, ExternalLink, Copy, Pause, Play } from 'lucide-react';

interface ExecuteStepProps {
  data: any;
}

const ExecuteStep: React.FC<ExecuteStepProps> = ({ data }) => {
  const [status, setStatus] = useState<'pending' | 'processing' | 'paused' | 'completed'>('pending');
  const [progress, setProgress] = useState(0);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [completedTxs, setCompletedTxs] = useState(0);
  const [failedTxs, setFailedTxs] = useState(0);

  useEffect(() => {
    if (status === 'processing') {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (Math.random() * 2);
          if (newProgress >= 100) {
            setStatus('completed');
            setCurrentBatch(25);
            setCompletedTxs(2497);
            setFailedTxs(3);
            return 100;
          }
          setCurrentBatch(Math.floor((newProgress / 100) * 25));
          setCompletedTxs(Math.floor((newProgress / 100) * 2500));
          return newProgress;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [status]);

  const startDistribution = () => {
    setStatus('processing');
  };

  const pauseDistribution = () => {
    setStatus('paused');
  };

  const resumeDistribution = () => {
    setStatus('processing');
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-8 h-8 text-green-400" />;
      case 'processing':
        return <Clock className="w-8 h-8 text-blue-400 animate-spin" />;
      case 'paused':
        return <Pause className="w-8 h-8 text-yellow-400" />;
      default:
        return <Clock className="w-8 h-8 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'processing':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'paused':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Execute Distribution</h2>
        <p className="text-gray-300">Monitor your distribution progress in real-time</p>
      </div>

      {/* Status Card */}
      <div className="glass-card rounded-2xl p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            {getStatusIcon()}
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-white">Q1 Airdrop Campaign</h3>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor()}`}>
                <span className="capitalize">{status}</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            {status === 'pending' && (
              <button
                onClick={startDistribution}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Distribution
              </button>
            )}
            
            {status === 'processing' && (
              <button
                onClick={pauseDistribution}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </button>
            )}
            
            {status === 'paused' && (
              <button
                onClick={resumeDistribution}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                <Play className="w-5 h-5 mr-2" />
                Resume
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {status !== 'pending' && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-300 mb-2">
              <span>Overall Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{currentBatch}/25</div>
            <div className="text-sm text-gray-400">Batches Processed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{completedTxs.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Successful</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{failedTxs}</div>
            <div className="text-sm text-gray-400">Failed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">2,500</div>
            <div className="text-sm text-gray-400">Total Recipients</div>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      {status !== 'pending' && (
        <div className="glass-card rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-white mb-6">Recent Transactions</h3>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Array.from({ length: Math.min(currentBatch, 10) }, (_, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <div>
                    <p className="text-white font-medium">Batch #{i + 1}</p>
                    <p className="text-sm text-gray-400">100 recipients • 10,000 USDC</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-400">0x1234...5678</span>
                  <button className="text-gray-400 hover:text-white">
                    <Copy className="w-4 h-4" />
                  </button>
                  <a
                    href={`https://etherscan.io/tx/0x1234567890123456789012345678901234567890123456789012345678901234`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completion Message */}
      {status === 'completed' && (
        <div className="glass-card rounded-2xl p-8 border border-green-500/30 mt-8">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">Distribution Completed!</h3>
            <p className="text-gray-300 mb-6">
              Your token distribution has been successfully completed. 
              {completedTxs.toLocaleString()} out of 2,500 transactions were successful.
            </p>
            
            <div className="flex justify-center space-x-4">
              <button className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg transition-all">
                <ExternalLink className="w-5 h-5 mr-2" />
                View Full Report
              </button>
              <button className="flex items-center px-6 py-3 glass-card text-white rounded-xl font-medium hover:bg-white/10 transition-all">
                Download CSV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecuteStep;