import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { blockchainService } from '../services/blockchain';
import { CONTRACT_ADDRESSES, DISPERZO_CORE_ABI, type Distribution } from '../contracts/DisperzoCore';

interface PrivyContractContextType {
  // Contract state
  isConnected: boolean;
  isInitialized: boolean;
  currentNetwork: string;
  contractAddress: string | null;
  
  // Wallet state
  address: string | null;
  balance: string | null;
  
  // Contract methods
  createDistribution: (params: any) => Promise<string>;
  getDistribution: (id: string) => Promise<Distribution>;
  getDistributionsByCreator: (creator: string) => Promise<string[]>;
  getTotalDistributions: () => Promise<number>;
  
  // Network methods
  switchNetwork: (networkId: string) => Promise<void>;
  getSupportedNetworks: () => any[];
  
  // Utility methods
  formatAddress: (address: string) => string;
  formatBalance: (balance: string) => string;
  getExplorerUrl: (txHash: string) => string;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

const PrivyContractContext = createContext<PrivyContractContextType | undefined>(undefined);

export const usePrivyContract = () => {
  const context = useContext(PrivyContractContext);
  if (context === undefined) {
    throw new Error('usePrivyContract must be used within a PrivyContractProvider');
  }
  return context;
};

interface PrivyContractProviderProps {
  children: ReactNode;
}

export const PrivyContractProvider: React.FC<PrivyContractProviderProps> = ({ children }) => {
  const { user, authenticated, ready } = usePrivy();
  const [isConnected, setIsConnected] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState('u2u-nebulas');
  const [contractAddress, setContractAddress] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize when user is authenticated
  useEffect(() => {
    const initialize = async () => {
      if (!ready || !authenticated || !user) {
        setIsConnected(false);
        setIsInitialized(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Get wallet from Privy
        const wallet = user.wallet;
        if (!wallet || !wallet.address) {
          throw new Error('No wallet connected. Please connect your wallet first.');
        }

        // Get contract address
        const contractAddr = CONTRACT_ADDRESSES[currentNetwork as keyof typeof CONTRACT_ADDRESSES];
        if (!contractAddr) {
          throw new Error(`Contract not deployed on network: ${currentNetwork}`);
        }

        // Get network info
        const networkInfo = blockchainService.getNetworkInfo(currentNetwork);
        if (!networkInfo) {
          throw new Error(`Network ${currentNetwork} not supported`);
        }

        // Update state
        setAddress(wallet.address);
        setBalance('0'); // We'll fetch this separately
        setContractAddress(contractAddr);
        setIsConnected(true);
        setIsInitialized(true);

        console.log('Privy contract initialized successfully:', {
          address: wallet.address,
          network: currentNetwork,
          contractAddress: contractAddr
        });

      } catch (err) {
        console.error('Error initializing Privy contract:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize contract';
        setError(errorMessage);
        setIsConnected(false);
        setIsInitialized(false);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(initialize, 1000);
    return () => clearTimeout(timer);
  }, [ready, authenticated, user, currentNetwork]);

  // Contract methods using Privy's wallet
  const createDistribution = async (params: any): Promise<string> => {
    if (!isInitialized || !user?.wallet) {
      throw new Error('Contract not initialized');
    }

    try {
      setIsLoading(true);
      setError(null);

      const contractAddress = CONTRACT_ADDRESSES[currentNetwork as keyof typeof CONTRACT_ADDRESSES];
      if (!contractAddress) {
        throw new Error(`Contract not deployed on network: ${currentNetwork}`);
      }

      // Prepare the transaction data
      let methodName = '';
      let methodParams: any[] = [];

      if (params.erc20Transfers && params.erc20Transfers.length > 0) {
        if (params.erc721Transfers && params.erc721Transfers.length > 0 || 
            params.erc1155Transfers && params.erc1155Transfers.length > 0) {
          // Mixed distribution
          methodName = 'mixedBulkTransfer';
          methodParams = [
            params.erc20Transfers || [],
            params.erc721Transfers || [],
            params.erc1155Transfers || [],
            params.name,
            params.description
          ];
        } else {
          // ERC20 only
          methodName = 'bulkTransferERC20';
          methodParams = [
            params.erc20Transfers,
            params.name,
            params.description
          ];
        }
      } else if (params.erc721Transfers && params.erc721Transfers.length > 0) {
        // ERC721 only
        methodName = 'bulkTransferERC721';
        methodParams = [
          params.erc721Transfers,
          params.name,
          params.description
        ];
      } else if (params.erc1155Transfers && params.erc1155Transfers.length > 0) {
        // ERC1155 only
        methodName = 'bulkTransferERC1155';
        methodParams = [
          params.erc1155Transfers,
          params.name,
          params.description
        ];
      } else {
        throw new Error('No valid transfers specified');
      }

      // Create the transaction
      const transaction = {
        to: contractAddress,
        data: encodeFunctionCall(methodName, methodParams),
        value: params.value ? ethers.parseEther(params.value) : '0',
      };

      // Send transaction using Privy
      const txHash = await user.wallet.sendTransaction(transaction);
      return txHash;

    } catch (err) {
      console.error('Error creating distribution:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create distribution';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getDistribution = async (id: string): Promise<Distribution> => {
    if (!isInitialized || !user?.wallet) {
      throw new Error('Contract not initialized');
    }

    try {
      const contractAddress = CONTRACT_ADDRESSES[currentNetwork as keyof typeof CONTRACT_ADDRESSES];
      if (!contractAddress) {
        throw new Error(`Contract not deployed on network: ${currentNetwork}`);
      }

      // Call contract method
      const result = await user.wallet.call({
        to: contractAddress,
        data: encodeFunctionCall('getDistribution', [id])
      });

      // Decode the result (simplified - you'd need proper ABI decoding)
      return {
        id: id,
        creator: '0x0000000000000000000000000000000000000000',
        name: 'Distribution',
        description: 'Distribution',
        createdAt: '0',
        totalRecipients: '0',
        totalValue: '0',
        isActive: true,
        isCompleted: false,
        completedAt: '0'
      };
    } catch (err) {
      console.error('Error getting distribution:', err);
      throw err;
    }
  };

  const getDistributionsByCreator = async (creator: string): Promise<string[]> => {
    if (!isInitialized || !user?.wallet) {
      throw new Error('Contract not initialized');
    }

    try {
      const contractAddress = CONTRACT_ADDRESSES[currentNetwork as keyof typeof CONTRACT_ADDRESSES];
      if (!contractAddress) {
        throw new Error(`Contract not deployed on network: ${currentNetwork}`);
      }

      const result = await user.wallet.call({
        to: contractAddress,
        data: encodeFunctionCall('getDistributionsByCreator', [creator])
      });

      // Decode result (simplified)
      return [];
    } catch (err) {
      console.error('Error getting distributions by creator:', err);
      throw err;
    }
  };

  const getTotalDistributions = async (): Promise<number> => {
    if (!isInitialized || !user?.wallet) {
      throw new Error('Contract not initialized');
    }

    try {
      const contractAddress = CONTRACT_ADDRESSES[currentNetwork as keyof typeof CONTRACT_ADDRESSES];
      if (!contractAddress) {
        throw new Error(`Contract not deployed on network: ${currentNetwork}`);
      }

      const result = await user.wallet.call({
        to: contractAddress,
        data: encodeFunctionCall('getTotalDistributions', [])
      });

      // Decode result (simplified)
      return 0;
    } catch (err) {
      console.error('Error getting total distributions:', err);
      throw err;
    }
  };

  const switchNetwork = async (networkId: string): Promise<void> => {
    if (!blockchainService.isNetworkSupported(networkId)) {
      throw new Error(`Network ${networkId} not supported`);
    }

    try {
      setIsLoading(true);
      setError(null);
      setCurrentNetwork(networkId);
      
      const contractAddr = CONTRACT_ADDRESSES[networkId as keyof typeof CONTRACT_ADDRESSES];
      if (contractAddr) {
        setContractAddress(contractAddr);
      }
    } catch (err) {
      console.error('Error switching network:', err);
      setError(err instanceof Error ? err.message : 'Failed to switch network');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getSupportedNetworks = () => {
    return blockchainService.getSupportedNetworks();
  };

  const formatAddress = (address: string): string => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance: string): string => {
    if (!balance) return '0';
    const num = parseFloat(balance);
    return num.toFixed(4);
  };

  const getExplorerUrl = (txHash: string): string => {
    const networkInfo = blockchainService.getNetworkInfo(currentNetwork);
    if (!networkInfo) return '';
    return `${networkInfo.explorerUrl}/tx/${txHash}`;
  };

  const value: PrivyContractContextType = {
    // Contract state
    isConnected,
    isInitialized,
    currentNetwork,
    contractAddress,
    
    // Wallet state
    address,
    balance,
    
    // Contract methods
    createDistribution,
    getDistribution,
    getDistributionsByCreator,
    getTotalDistributions,
    
    // Network methods
    switchNetwork,
    getSupportedNetworks,
    
    // Utility methods
    formatAddress,
    formatBalance,
    getExplorerUrl,
    
    // Loading states
    isLoading,
    error,
  };

  return (
    <PrivyContractContext.Provider value={value}>
      {children}
    </PrivyContractContext.Provider>
  );
};

// Helper function to encode function calls (simplified)
function encodeFunctionCall(methodName: string, params: any[]): string {
  // This is a simplified version - in production you'd use proper ABI encoding
  // For now, we'll return a placeholder
  return '0x';
}
