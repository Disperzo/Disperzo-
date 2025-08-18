import React, { useState } from 'react';
import { Coins, Settings, AlertCircle, Info } from 'lucide-react';

interface ConfigureStepProps {
  data: any;
  updateData: (data: any) => void;
}

const ConfigureStep: React.FC<ConfigureStepProps> = ({ data, updateData }) => {
  const [selectedToken, setSelectedToken] = useState('');
  const [distributionType, setDistributionType] = useState('equal');

  const tokens = [
    { symbol: 'ETH', name: 'Ethereum', balance: '10.5', icon: '⟠' },
    { symbol: 'USDC', name: 'USD Coin', balance: '50,000', icon: '💵' },
    { symbol: 'USDT', name: 'Tether', balance: '25,000', icon: '₮' },
    { symbol: 'DAI', name: 'Dai Stablecoin', balance: '15,000', icon: '◈' }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Configure Distribution</h2>
        <p className="text-gray-300">Select tokens, set amounts, and choose distribution parameters</p>
      </div>

      <div className="space-y-8">
        {/* Campaign Details */}
        <div className="glass-card rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Settings className="w-6 h-6 mr-3 text-purple-400" />
            Campaign Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Campaign Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all"
                placeholder="Q1 Airdrop Campaign"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description (Optional)
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all"
                placeholder="Token rewards for active community members"
              />
            </div>
          </div>
        </div>

        {/* Token Selection */}
        <div className="glass-card rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Coins className="w-6 h-6 mr-3 text-blue-400" />
            Select Token
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tokens.map((token) => (
              <div
                key={token.symbol}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedToken === token.symbol
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
                onClick={() => setSelectedToken(token.symbol)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{token.icon}</span>
                    <div>
                      <div className="font-semibold text-white">{token.symbol}</div>
                      <div className="text-sm text-gray-300">{token.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-white">{token.balance}</div>
                    <div className="text-sm text-gray-400">Available</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribution Settings */}
        <div className="glass-card rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-white mb-6">Distribution Type</h3>

          <div className="space-y-4 mb-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="distribution"
                value="equal"
                checked={distributionType === 'equal'}
                onChange={(e) => setDistributionType(e.target.value)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                distributionType === 'equal' ? 'border-purple-500' : 'border-gray-400'
              }`}>
                {distributionType === 'equal' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                )}
              </div>
              <div>
                <div className="font-medium text-white">Equal Distribution</div>
                <div className="text-sm text-gray-300">Same amount to all recipients</div>
              </div>
            </label>

            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="distribution"
                value="custom"
                checked={distributionType === 'custom'}
                onChange={(e) => setDistributionType(e.target.value)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                distributionType === 'custom' ? 'border-purple-500' : 'border-gray-400'
              }`}>
                {distributionType === 'custom' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                )}
              </div>
              <div>
                <div className="font-medium text-white">Custom Amounts</div>
                <div className="text-sm text-gray-300">Different amounts per recipient</div>
              </div>
            </label>
          </div>

          {distributionType === 'equal' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount per recipient
              </label>
              <div className="relative">
                <input
                  type="number"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all"
                  placeholder="100"
                />
                <div className="absolute right-3 top-3 text-gray-400">
                  {selectedToken || 'TOKEN'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Gas Settings */}
        <div className="glass-card rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-white mb-6">Gas Settings</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Gas Price (Gwei)
              </label>
              <input
                type="number"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all"
                placeholder="20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Gas Limit
              </label>
              <input
                type="number"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all"
                placeholder="21000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Batch Size
              </label>
              <input
                type="number"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all"
                placeholder="100"
              />
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <div className="text-blue-300 font-medium text-sm">Gas Optimization</div>
                <div className="text-blue-200/80 text-sm mt-1">
                  Higher batch sizes reduce gas costs but may increase transaction failure risk. 
                  We recommend starting with 100 recipients per batch.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="glass-card rounded-2xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-sm text-gray-400">Recipients</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">0 {selectedToken || 'TOKEN'}</div>
              <div className="text-sm text-gray-400">Total Amount</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">~$0</div>
              <div className="text-sm text-gray-400">Estimated Cost</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigureStep;