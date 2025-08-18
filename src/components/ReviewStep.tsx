import React from 'react';
import { CheckCircle, AlertCircle, Users, Coins, Zap, Clock } from 'lucide-react';

interface ReviewStepProps {
  data: any;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Review Distribution</h2>
        <p className="text-gray-300">Review all details before executing your token distribution</p>
      </div>

      <div className="space-y-6">
        {/* Campaign Summary */}
        <div className="glass-card rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-white mb-6">Campaign Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Campaign Name</label>
                <p className="text-white font-medium">Q1 Airdrop Campaign</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Description</label>
                <p className="text-white">Token rewards for active community members</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Distribution Type</label>
                <p className="text-white font-medium">Equal Distribution</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Status</label>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-green-400 font-medium">Ready to Execute</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Distribution Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center mb-4">
              <Users className="w-8 h-8 text-blue-400 mr-3" />
              <div>
                <h4 className="font-semibold text-white">Recipients</h4>
                <p className="text-sm text-gray-400">Total addresses</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-white">2,500</div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center mb-4">
              <Coins className="w-8 h-8 text-purple-400 mr-3" />
              <div>
                <h4 className="font-semibold text-white">Token Amount</h4>
                <p className="text-sm text-gray-400">Per recipient</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-white">100 USDC</div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center mb-4">
              <Zap className="w-8 h-8 text-orange-400 mr-3" />
              <div>
                <h4 className="font-semibold text-white">Est. Gas Cost</h4>
                <p className="text-sm text-gray-400">Total network fees</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-white">0.5 ETH</div>
          </div>
        </div>

        {/* Gas Settings Review */}
        <div className="glass-card rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-white mb-6">Gas Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="text-sm text-gray-400">Gas Price</label>
              <p className="text-white font-medium">20 Gwei</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Gas Limit</label>
              <p className="text-white font-medium">21,000</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Batch Size</label>
              <p className="text-white font-medium">100 recipients</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Total Batches</label>
              <p className="text-white font-medium">25 batches</p>
            </div>
          </div>
        </div>

        {/* Execution Timeline */}
        <div className="glass-card rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Clock className="w-6 h-6 mr-3 text-green-400" />
            Execution Timeline
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <div>
                <p className="text-white font-medium">Start Distribution</p>
                <p className="text-sm text-gray-400">Initialize first batch</p>
              </div>
              <div className="text-green-400 font-medium">~5 seconds</div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <div>
                <p className="text-white font-medium">Process Batches</p>
                <p className="text-sm text-gray-400">25 batches × 2 minutes each</p>
              </div>
              <div className="text-blue-400 font-medium">~50 minutes</div>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-white font-medium">Complete Distribution</p>
                <p className="text-sm text-gray-400">Final confirmations</p>
              </div>
              <div className="text-purple-400 font-medium">~55 minutes</div>
            </div>
          </div>
        </div>

        {/* Warnings & Confirmations */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-yellow-400 mt-1 mr-4 flex-shrink-0" />
            <div>
              <h4 className="text-yellow-300 font-semibold mb-2">Important Notices</h4>
              <ul className="text-yellow-200/80 text-sm space-y-1">
                <li>• Ensure you have sufficient token balance (250,000 USDC required)</li>
                <li>• Keep 0.5 ETH for gas fees in your wallet</li>
                <li>• Distribution cannot be paused once started</li>
                <li>• Failed transactions will be automatically retried</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Final Confirmation */}
        <div className="glass-card rounded-2xl p-8 border border-purple-500/30">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Execute</h3>
            <p className="text-gray-300 mb-6">
              Your distribution is configured and ready to launch. Click "Execute Distribution" to begin processing.
            </p>
            
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-white">2,500</div>
                <div className="text-sm text-gray-400">Recipients</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">250K</div>
                <div className="text-sm text-gray-400">USDC Total</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">0.5</div>
                <div className="text-sm text-gray-400">ETH Gas</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;