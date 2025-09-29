import React, { useState, useEffect } from 'react';
import { useContract } from '../contexts/ContractContext';
import { Wallet, Coins, Users, FileText, CheckCircle, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import NetworkSwitcher from '../components/NetworkSwitcher';
import ConnectionDebug from '../components/ConnectionDebug';
import CopyableAddress from '../components/CopyableAddress';

interface Recipient {
  address: string;
  amount: string;
  tokenId?: string;
}

interface DistributionData {
  name: string;
  description: string;
  tokenType: 'erc20' | 'erc721' | 'erc1155';
  tokenAddress: string;
  recipients: Recipient[];
  value?: string; // For ETH distributions
}

const DistributionWizard = () => {
  const { 
    isConnected, 
    isInitialized, 
    currentNetwork, 
    address, 
    balance, 
    createDistribution, 
    isLoading, 
    error,
    formatAddress,
    formatBalance,
    getExplorerUrl,
    refreshBalance
  } = useContract();

  const [currentStep, setCurrentStep] = useState(1);
  const [distributionData, setDistributionData] = useState<DistributionData>({
    name: '',
    description: '',
    tokenType: 'erc20',
    tokenAddress: '',
    recipients: [],
    value: '0'
  });
  const [txHash, setTxHash] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false);

  // Refresh balance when component mounts or address changes
  useEffect(() => {
    if (address && isInitialized) {
      const refresh = async () => {
        setIsRefreshingBalance(true);
        await refreshBalance();
        setIsRefreshingBalance(false);
      };
      refresh();
    }
  }, [address, isInitialized, refreshBalance]);

  // Test token addresses for U2U Nebulas
  const testTokens = {
    erc20: '0x42CF3742024Df63b4aEF53345349BBFE27C8Ee96',
    erc721: '0x1eC5638B1bFDc4cE2adE3232BB27fF829c2257a3',
    erc1155: '0x3776D327a73dE005a6Cd2a29F42aCF98238F974a'
  };

  const steps = [
    { id: 1, name: 'Token Selection', icon: Coins },
    { id: 2, name: 'Recipients', icon: Users },
    { id: 3, name: 'Review', icon: FileText },
    { id: 4, name: 'Execute', icon: CheckCircle }
  ];

  const handleTokenTypeChange = (type: 'erc20' | 'erc721' | 'erc1155') => {
    setDistributionData(prev => ({
      ...prev,
      tokenType: type,
      tokenAddress: testTokens[type],
      recipients: []
    }));
  };

  const addRecipient = () => {
    setDistributionData(prev => ({
      ...prev,
      recipients: [...prev.recipients, { address: '', amount: '', tokenId: '' }]
    }));
  };

  const updateRecipient = (index: number, field: keyof Recipient, value: string) => {
    setDistributionData(prev => ({
      ...prev,
      recipients: prev.recipients.map((recipient, i) => 
        i === index ? { ...recipient, [field]: value } : recipient
      )
    }));
  };

  const removeRecipient = (index: number) => {
    setDistributionData(prev => ({
      ...prev,
      recipients: prev.recipients.filter((_, i) => i !== index)
    }));
  };

  const handleCreateDistribution = async () => {
    if (!isInitialized) return;

    try {
      setIsCreating(true);
      
      // Prepare the data structure for the contract
      const params = {
        name: distributionData.name,
        description: distributionData.description,
        erc20Transfers: distributionData.tokenType === 'erc20' ? [{
          token: distributionData.tokenAddress,
          recipients: distributionData.recipients.map(r => r.address),
          amounts: distributionData.recipients.map(r => r.amount)
        }] : [],
        erc721Transfers: distributionData.tokenType === 'erc721' ? [{
          token: distributionData.tokenAddress,
          recipients: distributionData.recipients.map(r => r.address),
          tokenIds: distributionData.recipients.map(r => r.tokenId || '0')
        }] : [],
        erc1155Transfers: distributionData.tokenType === 'erc1155' ? [{
          token: distributionData.tokenAddress,
          recipients: distributionData.recipients.map(r => r.address),
          tokenIds: distributionData.recipients.map(r => r.tokenId || '0'),
          amounts: distributionData.recipients.map(r => r.amount)
        }] : [],
        value: distributionData.value || '0'
      };

      console.log('Sending distribution params:', params);
      console.log('Distribution data before sending:', distributionData);

      const hash = await createDistribution(params);
      setTxHash(hash);
      setCurrentStep(4);
    } catch (err) {
      console.error('Error creating distribution:', err);
    } finally {
      setIsCreating(false);
    }
  };

  if (!isConnected || !isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          {isLoading ? (
            <>
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600 mb-4">Connecting to U2U network...</p>
              <p className="text-sm text-gray-500">
                Please make sure your wallet is connected and you're on the U2U Nebulas testnet.
              </p>
            </>
          ) : error ? (
            <>
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Connection Failed</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
                <h3 className="font-medium text-yellow-800 mb-2">Troubleshooting Steps:</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Make sure you're logged in with Privy</li>
                  <li>• Connect your wallet (MetaMask, WalletConnect, etc.)</li>
                  <li>• Switch to U2U Nebulas testnet (Chain ID: 2484)</li>
                  <li>• Refresh the page and try again</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Wallet Not Connected</h2>
              <p className="text-gray-600">
                Please connect your wallet to use the distribution wizard.
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Distribution Wizard
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Create bulk token distributions on U2U Nebulas Testnet
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <div>
                <p className="text-green-800 font-medium">Connection Successful!</p>
                <p className="text-green-600 text-sm">
                  You're connected to U2U Nebulas testnet and ready to create distributions.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-2">
              <span>Wallet:</span>
              <CopyableAddress address={address || ''} />
            </div>
            <span>•</span>
            <div className="flex items-center space-x-2">
              <span>Balance: {formatBalance(balance || '0')} U2U</span>
              <button
                onClick={async () => {
                  setIsRefreshingBalance(true);
                  await refreshBalance();
                  setIsRefreshingBalance(false);
                }}
                disabled={isRefreshingBalance}
                className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                title="Refresh Balance"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshingBalance ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
          <div className="flex justify-center">
            <NetworkSwitcher />
          </div>
          
          {/* U2U Faucet Info */}
          {parseFloat(balance || '0') < 0.001 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-yellow-800 font-medium mb-1">Low U2U Balance</h3>
                  <p className="text-yellow-700 text-sm mb-2">
                    You need U2U tokens for gas fees. Get test tokens from the U2U faucet:
                  </p>
                  <a
                    href="https://faucet.u2uscan.xyz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                  >
                    Get U2U Test Tokens
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : isActive 
                        ? 'bg-blue-500 border-blue-500 text-white' 
                        : 'bg-white border-gray-300 text-gray-500'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.name}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Token Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { type: 'erc20', name: 'ERC20 Token', description: 'Fungible tokens (like USDC, USDT)' },
                  { type: 'erc721', name: 'ERC721 NFT', description: 'Non-fungible tokens (unique items)' },
                  { type: 'erc1155', name: 'ERC1155 Multi-Token', description: 'Both fungible and non-fungible' }
                ].map((token) => (
                  <button
                    key={token.type}
                    onClick={() => handleTokenTypeChange(token.type as any)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      distributionData.tokenType === token.type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h3 className="font-medium text-gray-900">{token.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{token.description}</p>
                  </button>
                ))}
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Token Contract Address
                </label>
                <input
                  type="text"
                  value={distributionData.tokenAddress}
                  onChange={(e) => setDistributionData(prev => ({ ...prev, tokenAddress: e.target.value }))}
                  placeholder="0x..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Test token: {testTokens[distributionData.tokenType]}
                </p>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={async () => {
                    try {
                      const testParams = {
                        name: 'Test Distribution',
                        description: 'Testing connection',
                        erc20Transfers: [{
                          token: distributionData.tokenAddress,
                          recipients: ['0x0000000000000000000000000000000000000000'],
                          amounts: ['1000000000000000000']
                        }]
                      };
                      const txHash = await createDistribution(testParams);
                      alert(`Test transaction sent! Hash: ${txHash}`);
                    } catch (err) {
                      alert(`Test failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
                    }
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Test Connection
                </button>
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!distributionData.tokenAddress}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next: Add Recipients
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Add Recipients</h2>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Distribution Details
                  </h3>
                  <button
                    onClick={addRecipient}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Add Recipient
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Distribution Name
                    </label>
                    <input
                      type="text"
                      value={distributionData.name}
                      onChange={(e) => setDistributionData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="My Token Distribution"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={distributionData.description}
                      onChange={(e) => setDistributionData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Optional description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* ETH Value Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ETH Value (for gas fees)
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      value={distributionData.value}
                      onChange={(e) => setDistributionData(prev => ({ ...prev, value: e.target.value }))}
                      placeholder="0.001"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Amount of ETH to send with the transaction (for gas fees)
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {distributionData.recipients.map((recipient, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={recipient.address}
                        onChange={(e) => updateRecipient(index, 'address', e.target.value)}
                        placeholder="0x..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="w-32">
                      <input
                        type="text"
                        value={recipient.amount}
                        onChange={(e) => updateRecipient(index, 'amount', e.target.value)}
                        placeholder={distributionData.tokenType === 'erc20' ? 'Amount' : 'Token ID'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={() => removeRecipient(index)}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={distributionData.recipients.length === 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next: Review
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Distribution</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Distribution Details</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>Name:</strong> {distributionData.name}</p>
                    <p><strong>Description:</strong> {distributionData.description}</p>
                    <p><strong>Token Type:</strong> {distributionData.tokenType.toUpperCase()}</p>
                    <p><strong>Token Address:</strong> {distributionData.tokenAddress}</p>
                    <p><strong>Recipients:</strong> {distributionData.recipients.length}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Recipients</h3>
                  <div className="space-y-2">
                    {distributionData.recipients.map((recipient, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-mono text-sm">{recipient.address}</span>
                        <span className="font-medium">{recipient.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Back
                </button>
                <button
                  onClick={handleCreateDistribution}
                  disabled={isCreating}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    'Create Distribution'
                  )}
                </button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="text-center">
              {txHash ? (
                <div>
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Distribution Created Successfully!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Your distribution has been submitted to the blockchain.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <p className="text-sm text-gray-600 mb-2">Transaction Hash:</p>
                    <p className="font-mono text-sm break-all">{txHash}</p>
                  </div>
                  <div className="flex justify-center space-x-4">
                    <a
                      href={getExplorerUrl(txHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      View on Explorer
                    </a>
                    <button
                      onClick={() => {
                        setCurrentStep(1);
                        setDistributionData({
                          name: '',
                          description: '',
                          tokenType: 'erc20',
                          tokenAddress: '',
                          recipients: [],
                          value: ''
                        });
                        setTxHash(null);
                      }}
                      className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      Create Another
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Creating Distribution...
                  </h2>
                  <p className="text-gray-600">
                    Please wait while your distribution is being processed.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <ConnectionDebug />
    </div>
  );
};

export default DistributionWizard;
