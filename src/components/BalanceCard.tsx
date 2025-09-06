import React, { useState } from 'react';
import { ChevronDown, Wallet, TrendingUp } from 'lucide-react';
import { useChain } from '../contexts/ChainContext';

interface Asset {
  symbol: string;
  name: string;
  balance: string;
  value: string;
  change24h: string;
  change24hPercent: number;
  icon?: string;
}

interface Chain {
  id: string;
  name: string;
  icon: string;
  assets: Asset[];
}

const BalanceCard: React.FC = () => {
  const { selectedChain, setSelectedChain } = useChain();
  const [isChainDropdownOpen, setIsChainDropdownOpen] = useState(false);

  const chains: Chain[] = [
    {
      id: 'ethereum',
      name: 'Ethereum',
      icon: '🔵',
      assets: [
        {
          symbol: 'ETH',
          name: 'Ethereum',
          balance: '2.4567',
          value: '$4,234.56',
          change24h: '+$123.45',
          change24hPercent: 3.2,
          icon: '🔵'
        },
        {
          symbol: 'USDC',
          name: 'USD Coin',
          balance: '5,000.00',
          value: '$5,000.00',
          change24h: '+$0.00',
          change24hPercent: 0.0,
          icon: '🔵'
        },
        {
          symbol: 'USDT',
          name: 'Tether',
          balance: '2,500.00',
          value: '$2,500.00',
          change24h: '+$12.50',
          change24hPercent: 0.5,
          icon: '🔵'
        }
      ]
    },
    {
      id: 'polygon',
      name: 'Polygon',
      icon: '🟣',
      assets: [
        {
          symbol: 'MATIC',
          name: 'Polygon',
          balance: '1,234.56',
          value: '$987.65',
          change24h: '+$45.67',
          change24hPercent: 4.8,
          icon: '🟣'
        },
        {
          symbol: 'USDC',
          name: 'USD Coin',
          balance: '3,000.00',
          value: '$3,000.00',
          change24h: '+$0.00',
          change24hPercent: 0.0,
          icon: '🟣'
        }
      ]
    },
    {
      id: 'bsc',
      name: 'BNB Smart Chain',
      icon: '🟡',
      assets: [
        {
          symbol: 'BNB',
          name: 'BNB',
          balance: '12.3456',
          value: '$3,456.78',
          change24h: '+$234.56',
          change24hPercent: 7.3,
          icon: '🟡'
        },
        {
          symbol: 'BUSD',
          name: 'Binance USD',
          balance: '1,000.00',
          value: '$1,000.00',
          change24h: '+$0.00',
          change24hPercent: 0.0,
          icon: '🟡'
        }
      ]
    },
    {
      id: 'arbitrum',
      name: 'Arbitrum',
      icon: '🔵',
      assets: [
        {
          symbol: 'ETH',
          name: 'Ethereum',
          balance: '0.5678',
          value: '$978.90',
          change24h: '+$23.45',
          change24hPercent: 2.5,
          icon: '🔵'
        },
        {
          symbol: 'USDC',
          name: 'USD Coin',
          balance: '1,500.00',
          value: '$1,500.00',
          change24h: '+$0.00',
          change24hPercent: 0.0,
          icon: '🔵'
        }
      ]
    },
    {
      id: 'optimism',
      name: 'Optimism',
      icon: '🔴',
      assets: [
        {
          symbol: 'ETH',
          name: 'Ethereum',
          balance: '0.2345',
          value: '$405.67',
          change24h: '+$15.23',
          change24hPercent: 3.9,
          icon: '🔴'
        },
        {
          symbol: 'USDC',
          name: 'USD Coin',
          balance: '800.00',
          value: '$800.00',
          change24h: '+$0.00',
          change24hPercent: 0.0,
          icon: '🔴'
        }
      ]
    },
    {
      id: 'base',
      name: 'Base',
      icon: '🔷',
      assets: [
        {
          symbol: 'ETH',
          name: 'Ethereum',
          balance: '0.1234',
          value: '$213.45',
          change24h: '+$12.34',
          change24hPercent: 6.1,
          icon: '🔷'
        },
        {
          symbol: 'USDC',
          name: 'USD Coin',
          balance: '500.00',
          value: '$500.00',
          change24h: '+$0.00',
          change24hPercent: 0.0,
          icon: '🔷'
        }
      ]
    },
    {
      id: 'somnia',
      name: 'Somnia',
      icon: '🌙',
      assets: [
        {
          symbol: 'SOMI',
          name: 'Somnia',
          balance: '1,234.56',
          value: '$987.65',
          change24h: '+$45.67',
          change24hPercent: 4.8,
          icon: '🌙'
        },
        {
          symbol: 'USDC',
          name: 'USD Coin',
          balance: '2,000.00',
          value: '$2,000.00',
          change24h: '+$0.00',
          change24hPercent: 0.0,
          icon: '🌙'
        }
      ]
    }
  ];

  // Non-EVM chains (Coming Soon)
  const comingSoonChains = [
    { id: 'solana', name: 'Solana', icon: '🟣' },
    { id: 'cosmos', name: 'Cosmos', icon: '🔵' },
    { id: 'polkadot', name: 'Polkadot', icon: '🟣' },
    { id: 'cardano', name: 'Cardano', icon: '🔵' },
    { id: 'avalanche', name: 'Avalanche', icon: '🔴' },
    { id: 'fantom', name: 'Fantom', icon: '🔵' }
  ];

  const currentChain = chains.find(chain => chain.id === selectedChain);
  const totalValue = currentChain?.assets.reduce((sum, asset) => {
    const value = parseFloat(asset.value.replace('$', '').replace(',', ''));
    return sum + value;
  }, 0) || 0;

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Wallet className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Portfolio Balance</h3>
            <p className="text-sm text-gray-600">Manage your assets across networks</p>
          </div>
        </div>
        
        {/* Chain Selector */}
        <div className="relative">
          <button
            onClick={() => setIsChainDropdownOpen(!isChainDropdownOpen)}
            className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors"
          >
            <span className="text-lg">{currentChain?.icon}</span>
            <span className="font-medium text-gray-900">{currentChain?.name}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          
          {isChainDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-10">
              <div className="p-2">
                {/* EVM Chains */}
                <div className="mb-2">
                  <div className="text-xs font-medium text-gray-500 px-3 py-1">EVM Compatible</div>
                  {chains.map((chain) => (
                    <button
                      key={chain.id}
                      onClick={() => {
                        setSelectedChain(chain.id);
                        setIsChainDropdownOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        selectedChain === chain.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="text-lg">{chain.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium">{chain.name}</div>
                        <div className="text-sm text-gray-500">
                          {chain.assets.length} assets
                        </div>
                      </div>
                      {selectedChain === chain.id && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
                
                {/* Coming Soon Chains */}
                <div className="border-t border-gray-100 pt-2">
                  <div className="text-xs font-medium text-gray-500 px-3 py-1">Coming Soon</div>
                  {comingSoonChains.map((chain) => (
                    <button
                      key={chain.id}
                      disabled
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left opacity-50 cursor-not-allowed"
                    >
                      <span className="text-lg">{chain.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-400">{chain.name}</div>
                        <div className="text-sm text-gray-400">Coming Soon</div>
                      </div>
                      <div className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                        Soon
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Total Balance */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Value</p>
            <p className="text-3xl font-bold text-gray-900">${totalValue.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center text-green-600 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              +$456.78 (12.5%)
            </div>
            <p className="text-xs text-gray-500">Last 24h</p>
          </div>
        </div>
      </div>

      {/* Assets List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">Assets on {currentChain?.name}</h4>
          <span className="text-sm text-gray-500">{currentChain?.assets.length} tokens</span>
        </div>
        
        <div className="space-y-3">
          {currentChain?.assets.map((asset, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-lg">{asset.icon}</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{asset.symbol}</div>
                  <div className="text-sm text-gray-500">{asset.name}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-medium text-gray-900">{asset.value}</div>
                <div className="text-sm text-gray-500">{asset.balance} {asset.symbol}</div>
                <div className={`text-xs ${getChangeColor(asset.change24hPercent)}`}>
                  {asset.change24h} ({asset.change24hPercent > 0 ? '+' : ''}{asset.change24hPercent}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BalanceCard; 