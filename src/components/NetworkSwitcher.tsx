import React, { useState } from 'react';
import { useContract } from '../contexts/ContractContext';
import { ChevronDown, Check, AlertCircle } from 'lucide-react';

const NetworkSwitcher = () => {
  const { currentNetwork, switchNetwork, getSupportedNetworks, isLoading } = useContract();
  const [isOpen, setIsOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const networks = getSupportedNetworks();
  const currentNetworkInfo = networks.find(n => n.id === currentNetwork);

  const handleNetworkSwitch = async (networkId: string) => {
    if (networkId === currentNetwork) {
      setIsOpen(false);
      return;
    }

    try {
      setIsSwitching(true);
      await switchNetwork(networkId);
      setIsOpen(false);
    } catch (error) {
      console.error('Error switching network:', error);
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading || isSwitching}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center space-x-2">
          <span className="text-lg">{currentNetworkInfo?.icon || '🔗'}</span>
          <span className="font-medium text-gray-900">
            {currentNetworkInfo?.name || 'Select Network'}
          </span>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-2">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Recommended for Testing
            </div>
            {networks
              .filter(network => network.isTestnet)
              .map((network) => (
                <button
                  key={network.id}
                  onClick={() => handleNetworkSwitch(network.id)}
                  disabled={isSwitching}
                  className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-50 rounded-lg disabled:opacity-50"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{network.icon}</span>
                    <div>
                      <div className="font-medium text-gray-900">{network.name}</div>
                      <div className="text-sm text-gray-500">Chain ID: {network.chainId}</div>
                    </div>
                  </div>
                  {network.id === currentNetwork && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                </button>
              ))}
            
            <div className="border-t border-gray-200 my-2"></div>
            
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Mainnet Networks
            </div>
            {networks
              .filter(network => !network.isTestnet)
              .map((network) => (
                <button
                  key={network.id}
                  onClick={() => handleNetworkSwitch(network.id)}
                  disabled={isSwitching}
                  className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-50 rounded-lg disabled:opacity-50"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{network.icon}</span>
                    <div>
                      <div className="font-medium text-gray-900">{network.name}</div>
                      <div className="text-sm text-gray-500">Chain ID: {network.chainId}</div>
                    </div>
                  </div>
                  {network.id === currentNetwork && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                </button>
              ))}
          </div>
        </div>
      )}

      {/* U2U Testnet Info */}
      {currentNetwork === 'u2u-nebulas' && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-blue-800 font-medium">U2U Nebulas Testnet</p>
              <p className="text-blue-600">
                You're connected to the testnet. Get test U2U tokens from the faucet.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkSwitcher;
