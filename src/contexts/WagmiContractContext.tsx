import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAccount, useBalance, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain } from 'wagmi';
import { usePrivy } from '@privy-io/react-auth';
import { parseEther, formatEther } from 'viem';
import { blockchainService } from '../services/blockchain';
import { type Distribution, CONTRACT_ADDRESSES, DISPERZO_CORE_ABI, ERC20_ABI } from '../contracts/DisperzoCore';

interface ContractContextType {
  isConnected: boolean;
  isInitialized: boolean;
  address: string | null;
  balance: string | null;
  currentNetwork: string;
  contractAddress: string | null;
  createDistribution: (params: {
    name: string;
    description: string;
    erc20Transfers?: Array<{
      token: string;
      recipients: string[];
      amounts: string[];
    }>;
    erc721Transfers?: Array<{
      token: string;
      recipients: string[];
      tokenIds: string[];
    }>;
    erc1155Transfers?: Array<{
      token: string;
      recipients: string[];
      tokenIds: string[];
      amounts: string[];
    }>;
    value?: string;
  }) => Promise<string>;
  getDistribution: (id: string) => Promise<Distribution>;
  getDistributionsByCreator: () => Promise<string[]>;
  getTotalDistributions: () => Promise<number>;
  switchNetwork: (networkId: string) => Promise<void>;
  getSupportedNetworks: () => Array<{
    id: string;
    name: string;
    chainId: number;
    rpcUrl: string;
    explorerUrl: string;
  }>;
  formatAddress: (address: string) => string;
  formatBalance: (balance: string) => string;
  getExplorerUrl: (txHash: string) => string;
  refreshBalance: () => Promise<void>;
  mintTestUSDC: (amount: string) => Promise<string>;
  isLoading: boolean;
  error: string | null;
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

interface ContractProviderProps {
  children: ReactNode;
}

export const WagmiContractProvider: React.FC<ContractProviderProps> = ({ children }) => {
  const { user, authenticated, ready } = usePrivy();
  const { address, isConnected: wagmiConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  
  const [isConnected, setIsConnected] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState('u2u-nebulas');
  const [contractAddress, setContractAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get balance using wagmi hook
  const { data: balanceData, refetch: refetchBalance } = useBalance({
    address: address as `0x${string}`,
    chainId: 2484, // U2U Nebulas
  });

  // Write contract hook for distributions
  const { 
    writeContract: writeDistribution, 
    data: distributionTxHash, 
    isPending: isDistributionPending,
    error: distributionError 
  } = useWriteContract();

  // Write contract hook for USDC minting
  const { 
    writeContract: writeUSDC, 
    data: usdcTxHash, 
    isPending: isUSDCPending,
    error: usdcError 
  } = useWriteContract();

  // Wait for distribution transaction
  const { isLoading: isDistributionConfirming } = useWaitForTransactionReceipt({
    hash: distributionTxHash,
  });

  // Wait for USDC transaction
  const { isLoading: isUSDCConfirming } = useWaitForTransactionReceipt({
    hash: usdcTxHash,
  });

  // Initialize contract when user is authenticated
  useEffect(() => {
    const initializeContract = async () => {
      if (!ready || !authenticated || !user?.wallet || !address) {
        setIsConnected(false);
        setIsInitialized(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const contractAddr = CONTRACT_ADDRESSES[currentNetwork as keyof typeof CONTRACT_ADDRESSES];

        if (!contractAddr) {
          throw new Error(`Contract not deployed on network: ${currentNetwork}`);
        }

        setContractAddress(contractAddr);
        setIsConnected(true);
        setIsInitialized(true);

        console.log('Wagmi Contract initialized successfully:', {
          address: address,
          network: currentNetwork,
          contractAddress: contractAddr,
          chainId: chainId
        });

      } catch (err) {
        console.error('Error initializing wagmi contract:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize contract';
        setError(errorMessage);
        setIsConnected(false);
        setIsInitialized(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay to ensure wallet is fully loaded
    const timer = setTimeout(initializeContract, 1000);
    return () => clearTimeout(timer);
  }, [ready, authenticated, user, address, currentNetwork, chainId]);

  // Contract methods using wagmi hooks
  const createDistribution = async (params: {
    name: string;
    description: string;
    erc20Transfers?: Array<{
      token: string;
      recipients: string[];
      amounts: string[];
    }>;
    erc721Transfers?: Array<{
      token: string;
      recipients: string[];
      tokenIds: string[];
    }>;
    erc1155Transfers?: Array<{
      token: string;
      recipients: string[];
      tokenIds: string[];
      amounts: string[];
    }>;
    value?: string;
  }): Promise<string> => {
    if (!isInitialized || !address) {
      throw new Error('Contract not initialized');
    }

    try {
      setIsLoading(true);
      setError(null);

      const contractAddr = CONTRACT_ADDRESSES[currentNetwork as keyof typeof CONTRACT_ADDRESSES];
      if (!contractAddr) {
        throw new Error(`Contract not deployed on network: ${currentNetwork}`);
      }

      const erc20Transfers = params.erc20Transfers || [];
      const name = params.name || 'Test Distribution';
      const description = params.description || 'Test distribution created via Disperzo';
      const value = params.value || '0';
      
      console.log('🔍 Creating distribution with wagmi:', {
        erc20Transfers: erc20Transfers,
        name: name,
        description: description,
        value: value,
        contractAddress: contractAddr,
        walletAddress: address
      });
      
      // Clean erc20Transfers to ensure no empty values and proper types
      const cleanErc20Transfers = erc20Transfers.map((transfer, index) => {
        console.log(`🔍 Transfer ${index}:`, transfer);
        
        if (!transfer || typeof transfer !== 'object') {
          throw new Error(`Invalid transfer at index ${index}: ${JSON.stringify(transfer)}`);
        }
        
        const cleanTransfer = {
          token: transfer.token as `0x${string}`,
          recipients: transfer.recipients.map(addr => addr as `0x${string}`),
          amounts: transfer.amounts.map(amount => parseEther(amount))
        };
        
        // Validate token address
        if (!cleanTransfer.token) {
          throw new Error(`Empty token address at index ${index}`);
        }
        
        // Validate recipients and amounts arrays
        if (!Array.isArray(cleanTransfer.recipients) || cleanTransfer.recipients.length === 0) {
          throw new Error(`Invalid recipients array at index ${index}`);
        }
        
        if (!Array.isArray(cleanTransfer.amounts) || cleanTransfer.amounts.length === 0) {
          throw new Error(`Invalid amounts array at index ${index}`);
        }
        
        // Check for empty strings in amounts
        const hasEmptyAmounts = transfer.amounts.some(amount => amount === '' || amount === null || amount === undefined);
        if (hasEmptyAmounts) {
          throw new Error(`Empty amount found in transfer ${index}. Amounts: ${JSON.stringify(transfer.amounts)}`);
        }
        
        console.log(`✅ Clean transfer ${index}:`, cleanTransfer);
        return cleanTransfer;
      });
      
      console.log('✅ All transfers cleaned:', cleanErc20Transfers);

      // Prepare transaction parameters
      const cleanValue = value === '' || value === '0' ? '0' : value;
      const testValue = cleanValue === '0' ? '0' : '0.001'; // Use 0.001 U2U for testing
      const valueInWei = parseEther(testValue);

      console.log('Value processing:', {
        originalValue: value,
        cleanValue: cleanValue,
        testValue: testValue,
        valueInWei: valueInWei.toString()
      });

      // Use wagmi writeContract for the transaction
      if (cleanErc20Transfers.length > 0) {
        await writeDistribution({
          address: contractAddr as `0x${string}`,
          abi: DISPERZO_CORE_ABI,
          functionName: 'bulkTransferERC20',
          args: [cleanErc20Transfers, name, description],
          value: valueInWei,
          gas: 500000n, // Increased gas limit for bulk transfers
          maxFeePerGas: parseEther('0.000000002'), // 2 gwei
          maxPriorityFeePerGas: parseEther('0.000000001'), // 1 gwei
        });
      } else {
        // Clean ERC721 transfers
        const cleanErc721Transfers = (params.erc721Transfers || []).map(transfer => ({
          token: transfer.token as `0x${string}`,
          recipients: transfer.recipients.map(addr => addr as `0x${string}`),
          tokenIds: transfer.tokenIds.map(id => BigInt(id))
        }));

        // Clean ERC1155 transfers
        const cleanErc1155Transfers = (params.erc1155Transfers || []).map(transfer => ({
          token: transfer.token as `0x${string}`,
          recipients: transfer.recipients.map(addr => addr as `0x${string}`),
          tokenIds: transfer.tokenIds.map(id => BigInt(id)),
          amounts: transfer.amounts.map(amount => BigInt(amount))
        }));

        await writeDistribution({
          address: contractAddr as `0x${string}`,
          abi: DISPERZO_CORE_ABI,
          functionName: 'mixedBulkTransfer',
          args: [
            cleanErc20Transfers,
            cleanErc721Transfers,
            cleanErc1155Transfers,
            name,
            description
          ],
          value: valueInWei,
          gas: 300000n, // Increased gas limit for mixed transfers
          maxFeePerGas: parseEther('0.000000002'), // 2 gwei
          maxPriorityFeePerGas: parseEther('0.000000001'), // 1 gwei
        });
      }

      // Wait for the transaction to be submitted
      if (!distributionTxHash) {
        throw new Error('Transaction submission failed');
      }

      console.log('✅ Distribution transaction submitted:', distributionTxHash);
      return distributionTxHash;

    } catch (err) {
      console.error('Error creating distribution:', err);
      setError(err instanceof Error ? err.message : 'Failed to create distribution');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getDistribution = async (id: string): Promise<Distribution> => {
    // Placeholder implementation
    return {
      id,
      creator: address || '',
      name: 'Sample Distribution',
      description: 'This is a sample distribution',
      createdAt: Date.now().toString(),
      totalRecipients: '0',
      totalValue: '0',
      isActive: false,
      isCompleted: false,
      completedAt: '0'
    };
  };

  const getDistributionsByCreator = async (): Promise<string[]> => {
    // Placeholder implementation
    return [];
  };

  const getTotalDistributions = async (): Promise<number> => {
    // Placeholder implementation
    return 0;
  };

  const switchNetwork = async (networkId: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Update the current network
      setCurrentNetwork(networkId);
      
      // Get the chain ID for the network
      const networkInfo = blockchainService.getNetworkInfo(networkId);
      if (networkInfo && switchChain) {
        await switchChain({ chainId: networkInfo.chainId as 1 | 2484 | 11155111 });
      }
      
      console.log('Switched to network:', networkId);
    } catch (err) {
      console.error('Error switching network:', err);
      setError(err instanceof Error ? err.message : 'Failed to switch network');
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
    if (!balance) return '0.0000';
    const num = parseFloat(balance);
    return num.toFixed(4);
  };

  const getExplorerUrl = (txHash: string): string => {
    const networkInfo = blockchainService.getNetworkInfo(currentNetwork);
    if (!networkInfo) return '';
    return `${networkInfo.explorerUrl}/tx/${txHash}`;
  };

  const refreshBalance = async (): Promise<void> => {
    if (address) {
      await refetchBalance();
    }
  };

  const mintTestUSDC = async (amount: string): Promise<string> => {
    if (!isInitialized || !address) {
      throw new Error('Contract not initialized');
    }

    try {
      setIsLoading(true);
      setError(null);

      const testUSDCAddress = '0x6011DB9397163d1782B57fEcB77C52EDBf1Dfe27';

      console.log('Minting test USDC with wagmi:', {
        tokenAddress: testUSDCAddress,
        to: address,
        amount: amount,
        amountWei: parseEther(amount).toString()
      });

      // Use wagmi writeContract for USDC minting with proper gas settings
      await writeUSDC({
        address: testUSDCAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'mint',
        args: [address as `0x${string}`, parseEther(amount)],
        gas: 300000n, // Reasonable gas limit for minting operations
        maxFeePerGas: parseEther('0.000000002'), // 2 gwei (higher than minimum)
        maxPriorityFeePerGas: parseEther('0.000000001'), // 1 gwei
      });

      // Wait for the transaction to be submitted
      if (!usdcTxHash) {
        throw new Error('USDC minting transaction submission failed');
      }

      console.log('✅ Test USDC mint transaction submitted:', usdcTxHash);
      return usdcTxHash;

    } catch (err) {
      console.error('Error minting test USDC:', err);
      setError(err instanceof Error ? err.message : 'Failed to mint test USDC');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Combine loading states
  const combinedIsLoading = isLoading || isDistributionPending || isUSDCPending || isDistributionConfirming || isUSDCConfirming;

  // Combine error states
  const combinedError: string | null = error || distributionError?.message || usdcError?.message || null;

  const value: ContractContextType = {
    isConnected: isConnected && wagmiConnected,
    isInitialized,
    address: address || null,
    balance: balanceData ? formatEther(balanceData.value) : null,
    currentNetwork,
    contractAddress,
    createDistribution,
    getDistribution,
    getDistributionsByCreator,
    getTotalDistributions,
    switchNetwork,
    getSupportedNetworks,
    formatAddress,
    formatBalance,
    getExplorerUrl,
    refreshBalance,
    mintTestUSDC,
    isLoading: combinedIsLoading,
    error: combinedError,
  };

  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error('useContract must be used within a ContractProvider');
  }
  return context;
};
