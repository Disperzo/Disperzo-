import React, { useState, useEffect } from 'react';
import { ChevronDown, Wallet, TrendingUp } from 'lucide-react';
import { useChain } from '../contexts/ChainContext';
import { useContract } from '../contexts/ContractContext';
import { TEST_TOKEN_ADDRESSES, ERC20_ABI } from '../contracts/DisperzoCore';
import { readContract } from '@wagmi/core';
import { formatUnits } from 'viem';
import { config } from '../config/wagmi';

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
  const { address, balance, isConnected, refreshBalance } = useContract();
  const [isChainDropdownOpen, setIsChainDropdownOpen] = useState(false);
  const [realBalances, setRealBalances] = useState<Asset[]>([]);

  // Fetch real balances when connected
  useEffect(() => {
    const fetchRealBalances = async () => {
      if (isConnected && address && selectedChain === 'u2u-nebulas') {
        try {
          // Refresh balance from contract context
          await refreshBalance();
          
          const assets: Asset[] = [];
          
          // Add U2U native balance
          const u2uBalance = balance || '0';
          const u2uValue = parseFloat(u2uBalance) * 0.5; // Assuming U2U price is $0.5
          
          if (parseFloat(u2uBalance) > 0) {
            assets.push({
              symbol: 'U2U',
              name: 'U2U',
              balance: parseFloat(u2uBalance).toFixed(4),
              value: `$${u2uValue.toFixed(2)}`,
              change24h: '+$0.00',
              change24hPercent: 0.0,
              icon: '🦄'
            });
          }
          
          // Fetch ERC-20 token balances
          const tokenAddresses = TEST_TOKEN_ADDRESSES['u2u-nebulas'];
          if (tokenAddresses?.erc20) {
            try {
              // Get token balance
              const tokenBalance = await readContract(config, {
                address: tokenAddresses.erc20 as `0x${string}`,
                abi: ERC20_ABI,
                functionName: 'balanceOf',
                args: [address as `0x${string}`]
              });
              
              // Get token decimals
              const decimals = await readContract(config, {
                address: tokenAddresses.erc20 as `0x${string}`,
                abi: ERC20_ABI,
                functionName: 'decimals'
              });
              
              // Get token symbol
              const symbol = await readContract(config, {
                address: tokenAddresses.erc20 as `0x${string}`,
                abi: ERC20_ABI,
                functionName: 'symbol'
              });
              
              const formattedBalance = formatUnits(tokenBalance as bigint, decimals as number);
              const balanceNumber = parseFloat(formattedBalance);
              
              if (balanceNumber > 0) {
                // Format balance with appropriate decimal places based on token type
                const isUSDC = (symbol as string).toLowerCase().includes('usdc');
                const displayBalance = isUSDC 
                  ? balanceNumber.toFixed(2) // USDC typically shows 2 decimal places
                  : balanceNumber.toFixed(4); // Other tokens show 4 decimal places
                
                // Calculate USD value (assuming $1 for USDC, $0.5 for other tokens)
                const tokenPrice = isUSDC ? 1.0 : 0.5;
                const usdValue = balanceNumber * tokenPrice;
                
                assets.push({
                  symbol: symbol as string,
                  name: isUSDC ? 'USD Coin' : `${symbol} Token`,
                  balance: displayBalance,
                  value: `$${usdValue.toFixed(2)}`,
                  change24h: '+$0.00',
                  change24hPercent: 0.0,
                  icon: isUSDC ? '💵' : '🪙'
                });
              }
            } catch (tokenError) {
              console.log('Token balance fetch failed (this is normal if no tokens):', tokenError);
            }
          }
          
          setRealBalances(assets);
        } catch (error) {
          console.error('Error fetching real balances:', error);
        }
      }
    };

    fetchRealBalances();
  }, [isConnected, address, selectedChain, balance, refreshBalance]);

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
    },
    {
      id: 'u2u-solar',
      name: 'U2U Solar',
      icon: '🦄',
      assets: [
        {
          symbol: 'U2U',
          name: 'U2U',
          balance: '2,500.00',
          value: '$1,250.00',
          change24h: '+$75.00',
          change24hPercent: 6.4,
          icon: '🦄'
        },
        {
          symbol: 'USDC',
          name: 'USD Coin',
          balance: '1,500.00',
          value: '$1,500.00',
          change24h: '+$0.00',
          change24hPercent: 0.0,
          icon: '🦄'
        }
      ]
    },
    {
      id: 'u2u-nebulas',
      name: 'U2U Nebulas',
      icon: '🦄',
      assets: isConnected && selectedChain === 'u2u-nebulas' && realBalances.length > 0 
        ? realBalances 
        : [
            {
              symbol: 'U2U',
              name: 'U2U',
              balance: '139.99',
              value: '$69.99',
              change24h: '+$5.00',
              change24hPercent: 7.7,
              icon: '🦄'
            },
            {
              symbol: 'USDC',
              name: 'USD Coin',
              balance: '500.00',
              value: '$500.00',
              change24h: '+$0.00',
              change24hPercent: 0.0,
              icon: '🦄'
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
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
            <Wallet className="w-3 h-3 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Portfolio Balance</h3>
            <p className="text-xs text-gray-600">Manage your assets across networks</p>
          </div>
        </div>
        
        {/* Chain Selector */}
        <div className="relative">
          <button
            onClick={() => setIsChainDropdownOpen(!isChainDropdownOpen)}
            className="flex items-center space-x-1 bg-gray-50 hover:bg-gray-100 px-2 py-1 rounded-lg transition-colors"
          >
            <span className="text-sm">{currentChain?.icon}</span>
            <span className="font-medium text-gray-900 text-xs">{currentChain?.name}</span>
            <ChevronDown className="w-3 h-3 text-gray-500" />
          </button>
          
          {isChainDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <div className="p-1">
                {/* EVM Chains */}
                <div className="mb-1">
                  <div className="text-xs font-medium text-gray-500 px-2 py-0.5">EVM Compatible</div>
                  {chains.map((chain) => (
                    <button
                      key={chain.id}
                      onClick={() => {
                        setSelectedChain(chain.id);
                        setIsChainDropdownOpen(false);
                      }}
                      className={`w-full flex items-center space-x-2 px-2 py-1 rounded-lg text-left transition-colors ${
                        selectedChain === chain.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="text-sm">{chain.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-xs">{chain.name}</div>
                        <div className="text-xs text-gray-500">
                          {chain.assets.length} assets
                        </div>
                      </div>
                      {selectedChain === chain.id && (
                        <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
                
                {/* Coming Soon Chains */}
                <div className="border-t border-gray-100 pt-1">
                  <div className="text-xs font-medium text-gray-500 px-2 py-0.5">Coming Soon</div>
                  {comingSoonChains.map((chain) => (
                    <button
                      key={chain.id}
                      disabled
                      className="w-full flex items-center space-x-2 px-2 py-1 rounded-lg text-left opacity-50 cursor-not-allowed"
                    >
                      <span className="text-sm">{chain.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-400 text-xs">{chain.name}</div>
                        <div className="text-xs text-gray-400">Coming Soon</div>
                      </div>
                      <div className="text-xs bg-gray-100 text-gray-500 px-1 py-0.5 rounded-full">
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
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600 mb-0.5">Total Value</p>
            <p className="text-lg font-bold text-gray-900">${totalValue.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center text-green-600 text-xs">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              +$456.78 (12.5%)
            </div>
            <p className="text-xs text-gray-500">Last 24h</p>
          </div>
        </div>
      </div>

      {/* Assets List */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-gray-900 text-sm">Assets on {currentChain?.name}</h4>
          <span className="text-xs text-gray-500">{currentChain?.assets.length} tokens</span>
        </div>
        
        <div className="space-y-2">
          {currentChain?.assets.map((asset, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-sm">{asset.icon}</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-xs">{asset.symbol}</div>
                  <div className="text-xs text-gray-500">{asset.name}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-medium text-gray-900 text-xs">{asset.value}</div>
                <div className="text-xs text-gray-500">{asset.balance} {asset.symbol}</div>
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