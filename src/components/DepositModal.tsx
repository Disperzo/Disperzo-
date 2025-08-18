import React, { useState } from 'react';
import { X, DollarSign } from 'lucide-react';

interface DepositModalProps {
  onClose: () => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ onClose }) => {
  const [selectedNetwork, setSelectedNetwork] = useState('Polygon');

  // EVM Compatible Networks
  const evmNetworks = [
    { name: 'Ethereum', logo: '🔵', color: 'blue' },
    { name: 'Polygon', logo: '🟣', color: 'purple' },
    { name: 'Arbitrum', logo: '🔵', color: 'blue' },
    { name: 'Base', logo: '🔷', color: 'blue' },
    { name: 'Optimism', logo: '🔴', color: 'red' },
    { name: 'BSC', logo: '🟡', color: 'yellow' }
  ];

  // Non-EVM Networks (Coming Soon)
  const comingSoonNetworks = [
    { name: 'Starknet', logo: '⭐', color: 'purple' },
    { name: 'Solana', logo: '⚡', color: 'purple' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Deposit</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          {/* USDC Section */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <span className="text-sm italic text-gray-700">
                Deposit USDC in your account.
              </span>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
              Deposit USDC
            </h3>

            {/* Network Selection */}
            <div className="space-y-1.5">
              {evmNetworks.map((network) => (
                <button
                  key={network.name}
                  onClick={() => setSelectedNetwork(network.name)}
                  className={`w-full flex items-center space-x-2 p-2.5 rounded-lg border transition-colors ${
                    selectedNetwork === network.name
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm`}>
                    {network.logo}
                  </div>
                  <span className="font-medium text-gray-900 text-sm">{network.name}</span>
                </button>
              ))}
              
              {/* Coming Soon Networks */}
              <div className="pt-1.5 border-t border-gray-100">
                <div className="text-xs font-medium text-gray-500 px-2 py-1">Coming Soon</div>
                {comingSoonNetworks.map((network) => (
                  <button
                    key={network.name}
                    disabled
                    className="w-full flex items-center space-x-2 p-2.5 rounded-lg border border-gray-200 opacity-50 cursor-not-allowed"
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm`}>
                      {network.logo}
                    </div>
                    <span className="font-medium text-gray-400 text-sm">{network.name}</span>
                    <div className="ml-auto">
                      <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                        Soon
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Other Tokens Section */}
          <div className="border-t pt-4">
            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
              Deposit USDC Using Other Tokens
            </h3>
            
            <button className="w-full p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-0.5">
                    <span className="text-sm">💎</span>
                    <span className="text-sm">🟡</span>
                    <span className="text-sm">🟠</span>
                  </div>
                  <span className="text-gray-900 text-sm">Add fund using other tokens and networks</span>
                </div>
              </div>
            </button>
          </div>

          {/* Powered by LI.FI */}
          <div className="text-center pt-3 border-t">
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <span>Powered by</span>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-black rounded"></div>
                <span className="font-medium">LI.FI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositModal; 