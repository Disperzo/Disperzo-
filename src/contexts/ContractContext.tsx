import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ethers } from 'ethers';
import { usePrivy } from '@privy-io/react-auth';
// import { distributionService } from '../services/distributionService';
import { blockchainService } from '../services/blockchain';
import { type Distribution, CONTRACT_ADDRESSES, DISPERZO_CORE_ABI } from '../contracts/DisperzoCore';

interface ContractContextType {
  isConnected: boolean;
  isInitialized: boolean;
  address: string | null;
  balance: string | null;
  currentNetwork: string;
  contractAddress: string | null;
  createDistribution: (params: any) => Promise<string>;
  getDistribution: (id: string) => Promise<Distribution>;
  getDistributionsByCreator: (creator: string) => Promise<string[]>;
  getTotalDistributions: () => Promise<number>;
  switchNetwork: (networkId: string) => Promise<void>;
  getSupportedNetworks: () => any[];
  formatAddress: (address: string) => string;
  formatBalance: (balance: string) => string;
  getExplorerUrl: (txHash: string) => string;
  refreshBalance: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

interface ContractProviderProps {
  children: ReactNode;
}

export const ContractProvider: React.FC<ContractProviderProps> = ({ children }) => {
  const { user, authenticated, ready, sendTransaction } = usePrivy();
  // const { wallets } = useWallets();
  
  const [isConnected, setIsConnected] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [currentNetwork, setCurrentNetwork] = useState('u2u-nebulas');
  const [contractAddress, setContractAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch balance function
  const fetchBalance = async (userAddress: string) => {
    if (!user?.wallet) return;

    try {
      const networkInfo = blockchainService.getNetworkInfo(currentNetwork);
      if (!networkInfo) return;

      const response = await fetch(networkInfo.rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getBalance',
          params: [userAddress, 'latest'],
          id: 1,
        }),
      });

      const data = await response.json();
      if (data.result) {
        const balanceWei = BigInt(data.result);
        const balanceEther = ethers.formatEther(balanceWei);
        setBalance(balanceEther);
        console.log('Balance fetched:', balanceEther, 'U2U');
      }
    } catch (err) {
      console.error('Error fetching balance:', err);
      setBalance('0');
    }
  };

  // Initialize contract when user is authenticated
  useEffect(() => {
    const initializeContract = async () => {
      if (!ready || !authenticated || !user?.wallet) {
        setIsConnected(false);
        setIsInitialized(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const userAddress = user.wallet.address;
        const contractAddr = CONTRACT_ADDRESSES[currentNetwork as keyof typeof CONTRACT_ADDRESSES];

        if (!contractAddr) {
          throw new Error(`Contract not deployed on network: ${currentNetwork}`);
        }

        setAddress(userAddress);
        setContractAddress(contractAddr);
        setIsConnected(true);
        setIsInitialized(true);
        setCurrentNetwork(currentNetwork);

        // Fetch balance
        await fetchBalance(userAddress);

        console.log('Contract initialized successfully:', {
          address: userAddress,
          network: currentNetwork,
          contractAddress: contractAddr
        });

      } catch (err) {
        console.error('Error initializing contract:', err);
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
  }, [ready, authenticated, user, currentNetwork]);

  // Contract methods - Simplified Privy approach
  const createDistribution = async (params: any): Promise<string> => {
    if (!isInitialized || !user?.wallet) {
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
      
      console.log('🔍 DEBUGGING: Raw parameters received:', {
        erc20Transfers: erc20Transfers,
        erc20TransfersLength: erc20Transfers.length,
        name: name,
        description: description,
        value: value,
        valueType: typeof value,
        valueEmpty: value === '',
        params: params
      });
      
      // Clean erc20Transfers to ensure no empty values
      const cleanErc20Transfers = erc20Transfers.map((transfer, index) => {
        console.log(`🔍 Transfer ${index}:`, transfer);
        
        if (!transfer || typeof transfer !== 'object') {
          throw new Error(`Invalid transfer at index ${index}: ${JSON.stringify(transfer)}`);
        }
        
        const cleanTransfer = {
          token: transfer.token || '',
          recipients: transfer.recipients || [],
          amounts: transfer.amounts || []
        };
        
        // Validate token address
        if (!cleanTransfer.token || cleanTransfer.token === '') {
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
        const hasEmptyAmounts = cleanTransfer.amounts.some(amount => amount === '' || amount === null || amount === undefined);
        if (hasEmptyAmounts) {
          throw new Error(`Empty amount found in transfer ${index}. Amounts: ${JSON.stringify(cleanTransfer.amounts)}`);
        }
        
        console.log(`✅ Clean transfer ${index}:`, cleanTransfer);
        return cleanTransfer;
      });
      
      console.log('✅ All transfers cleaned:', cleanErc20Transfers);

      console.log('Creating distribution with Privy wallet:', {
        erc20Transfers: cleanErc20Transfers,
        name,
        description,
        value,
        contractAddress: contractAddr,
        walletAddress: user.wallet.address
      });

      // Debug: Check what methods are available on the wallet
      console.log('Wallet object:', user.wallet);
      console.log('Wallet methods:', Object.keys(user.wallet));
      console.log('Wallet type:', user.wallet.connectorType);

      // Encode the function data
      const contract = new ethers.Contract(contractAddr, DISPERZO_CORE_ABI);
      
      // Debug: Check available functions in ABI
      const availableFunctions = contract.interface.fragments
        .filter(f => f.type === 'function')
        .map(f => ({ 
          name: (f as any).name, 
          selector: contract.interface.getFunction((f as any).name)?.selector 
        }))
        .filter(f => f.selector); // Filter out null selectors
      
      console.log('Available functions in ABI:', availableFunctions);
      
      let data;
      let functionName;
      let functionArgs;
      
      if (cleanErc20Transfers.length > 0) {
        functionName = 'bulkTransferERC20';
        functionArgs = [cleanErc20Transfers, name, description];
        
        // Check if function exists in ABI
        const functionFragment = contract.interface.getFunction(functionName);
        if (!functionFragment) {
          throw new Error(`Function ${functionName} not found in contract ABI. Available functions: ${availableFunctions.map(f => f.name).join(', ')}`);
        }
        
        data = contract.interface.encodeFunctionData(functionName, functionArgs);
        console.log('Encoding bulkTransferERC20 function:', {
          functionName: functionName,
          selector: data.substring(0, 10),
          expectedSelector: '0x5d86def3',
          actualSelector: functionFragment.selector,
          args: functionArgs,
          erc20TransfersLength: cleanErc20Transfers.length
        });
      } else {
        functionName = 'mixedBulkTransfer';
        functionArgs = [
          cleanErc20Transfers,
          params.erc721Transfers || [],
          params.erc1155Transfers || [],
          name,
          description
        ];
        
        // Check if function exists in ABI
        const functionFragment = contract.interface.getFunction(functionName);
        if (!functionFragment) {
          throw new Error(`Function ${functionName} not found in contract ABI. Available functions: ${availableFunctions.map(f => f.name).join(', ')}`);
        }
        
        data = contract.interface.encodeFunctionData(functionName, functionArgs);
        console.log('Encoding mixedBulkTransfer function:', {
          functionName: functionName,
          selector: data.substring(0, 10),
          expectedSelector: '0xcb4e1a20',
          actualSelector: functionFragment.selector,
          args: functionArgs,
          erc20TransfersLength: cleanErc20Transfers.length,
          erc721TransfersLength: (params.erc721Transfers || []).length,
          erc1155TransfersLength: (params.erc1155Transfers || []).length
        });
      }
      
      console.log('Function encoding complete:', {
        functionName: functionName,
        dataLength: data.length,
        selector: data.substring(0, 10),
        encodedData: data
      });

      // Use Privy's sendTransaction method for embedded wallets
      console.log('Using Privy sendTransaction method for embedded wallet');
      console.log('Wallet type:', user.wallet.connectorType);
      console.log('Wallet address:', user.wallet.address);
      console.log('Current network:', currentNetwork);
      console.log('Contract address:', contractAddr);
      
      // Check if we're on the correct network
      const currentNetworkInfo = blockchainService.getNetworkInfo(currentNetwork);
      if (!currentNetworkInfo) {
        throw new Error(`Network ${currentNetwork} not found`);
      }
      
      console.log('Network info:', {
        id: currentNetworkInfo.id,
        name: currentNetworkInfo.name,
        chainId: currentNetworkInfo.chainId,
        rpcUrl: currentNetworkInfo.rpcUrl
      });
      
      // Prepare the transaction for Privy's sendTransaction
      // Ensure value is never empty string
      const cleanValue = value === '' || value === '0' ? '0' : value;
      const testValue = cleanValue === '0' ? '0' : '0.001'; // Use 0.001 ETH for testing
      
      console.log('Value processing:', {
        originalValue: value,
        cleanValue: cleanValue,
        testValue: testValue,
        isEmpty: value === '',
        isZero: value === '0'
      });
      
      const valueInWei = ethers.parseEther(testValue);
      
      // Validate the value is positive and within safe range
      if (valueInWei < 0n) {
        throw new Error('Value cannot be negative');
      }
      
      // Check if value is within safe integer range (less than 2^53)
      const maxSafeValue = BigInt(Number.MAX_SAFE_INTEGER);
      if (valueInWei > maxSafeValue) {
        throw new Error('Value is too large for safe integer range');
      }
      
      const valueHex = '0x' + valueInWei.toString(16);
      
      console.log('Value conversion:', {
        original: value,
        cleanValue: cleanValue,
        testValue: testValue,
        wei: valueInWei.toString(),
        hex: valueHex,
        isSafe: valueInWei <= maxSafeValue,
        isEmpty: valueHex === '0x' || valueHex === ''
      });
      
      // Ensure valueHex is never empty
      if (!valueHex || valueHex === '0x' || valueHex === '') {
        throw new Error('Value conversion resulted in empty hex string');
      }
      
      // Use extremely low gas pricing for U2U network
      const maxFeePerGas = '0x3b9aca0'; // 0.001 gwei base fee (1,000,000 wei)
      const maxPriorityFeePerGas = '0x0'; // 0 priority fee
      
      console.log('Using ultra-low EIP-1559 gas pricing for U2U:', {
        maxFeePerGas: maxFeePerGas,
        maxPriorityFeePerGas: maxPriorityFeePerGas,
        maxFeePerGasGwei: parseInt(maxFeePerGas, 16) / 1000000000,
        maxFeePerGasWei: parseInt(maxFeePerGas, 16)
      });
      
      // Also set legacy gas price as fallback - even lower
      const gasPrice = '0x3b9aca0'; // 0.001 gwei (1,000,000 wei)
      console.log('Legacy gas price (fallback):', gasPrice, '(0.001 gwei)');

      // Use extremely low gas limit for U2U network
      let gasLimit = '0x1388'; // Fixed: 5,000 gas (ultra-conservative for U2U)
      
      // Skip network gas estimation as it's returning unrealistic values
      console.log('Using fixed gas limit:', gasLimit, '(5,000 gas) - bypassing network estimation');
      
      // For reference, let's still try to get an estimate but not use it
      try {
        const provider = (user.wallet as any).getEthereumProvider();
        if (provider && provider.request) {
          const gasEstimate = await provider.request({
            method: 'eth_estimateGas',
            params: [{
              to: contractAddr,
              data: data,
              value: valueHex,
              from: user.wallet.address
            }]
          });
          console.log('Network gas estimate (not used):', gasEstimate, 'Using fixed:', gasLimit);
        }
      } catch (gasError) {
        console.warn('Could not get gas estimate (using fixed limit):', gasError);
      }

      // Note: Using cleanTransaction and minimalTransaction instead of the complex transaction object

      // Calculate expected transaction fee using ultra-low EIP-1559 pricing
      const maxFeePerGasNum = parseInt(maxFeePerGas, 16);
      const gasLimitNum = parseInt(gasLimit, 16);
      const expectedFee = maxFeePerGasNum * gasLimitNum;
      const expectedFeeInU2U = ethers.formatEther(expectedFee.toString());
      
      console.log('Ultra-low gas calculation details (EIP-1559):', {
        maxFeePerGas: maxFeePerGas,
        maxFeePerGasNum: maxFeePerGasNum,
        maxFeePerGasGwei: maxFeePerGasNum / 1000000000,
        maxPriorityFeePerGas: maxPriorityFeePerGas,
        gasLimit: gasLimit,
        gasLimitNum: gasLimitNum,
        expectedFee: expectedFee.toString(),
        expectedFeeInU2U: expectedFeeInU2U,
        expectedFeeInWei: expectedFee
      });
      
      // Safety check: ensure fee is well under 100 U2U cap
      const expectedFeeInU2UNum = parseFloat(expectedFeeInU2U);
      if (expectedFeeInU2UNum > 50) { // Use 50 U2U as safety margin
        throw new Error(`Transaction fee too high: ${expectedFeeInU2U} U2U exceeds safety limit of 50 U2U. Gas parameters: maxFeePerGas=${maxFeePerGas} (${maxFeePerGasNum / 1000000000} gwei), gasLimit=${gasLimit} (${gasLimitNum})`);
      }
      
      // Check if user has enough balance for transaction + fees
      const currentBalance = parseFloat(balance || '0');
      const transactionValue = parseFloat(testValue);
      const totalRequired = transactionValue + expectedFeeInU2UNum;
      
      console.log('Balance check (ultra-low fees):', {
        currentBalance: currentBalance + ' U2U',
        transactionValue: transactionValue + ' U2U',
        expectedFee: expectedFeeInU2U + ' U2U',
        totalRequired: totalRequired + ' U2U',
        sufficient: currentBalance >= totalRequired,
        feeUnderCap: expectedFeeInU2UNum < 50
      });
      
      if (currentBalance < totalRequired) {
        throw new Error(`Insufficient balance. You have ${currentBalance} U2U but need ${totalRequired.toFixed(6)} U2U (${transactionValue} U2U for transaction + ${expectedFeeInU2U} U2U for gas fees). Please get more U2U from the faucet.`);
      }
      
      console.log('Transaction preparation complete:', {
        contractAddr: contractAddr,
        dataLength: data.length,
        dataPreview: data.substring(0, 20) + '...',
        functionSelector: data.substring(0, 10),
        valueHex: valueHex,
        valueInWei: valueInWei.toString(),
        currentNetwork: currentNetwork,
        currentNetworkInfo: currentNetworkInfo,
        walletChainId: (user.wallet as any).chainId,
        expectedFee: expectedFeeInU2U + ' U2U'
      });
      
      // Verify contract deployment by checking if there's code at the address
      try {
        // Use RPC call directly since Privy wallet doesn't expose provider
        const networkInfo = blockchainService.getNetworkInfo(currentNetwork);
        if (networkInfo) {
          const response = await fetch(networkInfo.rpcUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_getCode',
              params: [contractAddr, 'latest'],
              id: 1,
            }),
          });

          const data = await response.json();
          if (data.result) {
            const code = data.result;
            console.log('Contract code check:', {
              contractAddr: contractAddr,
              hasCode: code !== '0x',
              codeLength: code.length,
              codePreview: code.substring(0, 20) + '...'
            });
            
            if (code === '0x') {
              throw new Error(`No contract deployed at address ${contractAddr} on network ${currentNetwork}. Please verify the contract is deployed.`);
            }
          }
        }
      } catch (codeError) {
        console.error('Failed to check contract code:', codeError);
        // Continue anyway, but log the error
      }

      // Check if we're on the correct network - CRITICAL for U2U
      let walletChainId = (user.wallet as any).chainId;
      let numericChainId = null;
      
      // Try to get chainId from wallet first
      if (walletChainId) {
        // Extract numeric chainId from eip155 format
        numericChainId = parseInt(walletChainId.replace('eip155:', ''));
        console.log('Got chainId from wallet:', walletChainId, 'numeric:', numericChainId);
      } else {
        // If not available from wallet, try to get it from RPC
        try {
          const networkInfo = blockchainService.getNetworkInfo(currentNetwork);
          if (networkInfo) {
            const response = await fetch(networkInfo.rpcUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_chainId',
                params: [],
                id: 1,
              }),
            });

            const data = await response.json();
            if (data.result) {
              numericChainId = parseInt(data.result, 16);
              walletChainId = `eip155:${numericChainId}`;
              console.log('Got chainId from RPC:', walletChainId, 'numeric:', numericChainId);
            }
          }
        } catch (rpcError) {
          console.warn('Could not get chainId from RPC:', rpcError);
        }
      }
      
      console.log('Network check:', {
        walletChainId: walletChainId,
        numericChainId: numericChainId,
        expectedChainId: currentNetworkInfo.chainId,
        expectedChainIdEip155: `eip155:${currentNetworkInfo.chainId}`,
        currentNetwork: currentNetwork,
        isCorrectNetwork: numericChainId === currentNetworkInfo.chainId
      });
      
      // For Privy embedded wallets, network switching is handled automatically
      // We just need to ensure the transaction is sent on the correct network
      if (currentNetworkInfo && (!numericChainId || numericChainId !== currentNetworkInfo.chainId)) {
        console.log('❌ NETWORK MISMATCH DETECTED!');
        console.log('Current chain:', numericChainId, 'Expected:', currentNetworkInfo.chainId);
        console.log('Wallet type:', user.wallet.connectorType);
        
        if (user.wallet.connectorType === 'embedded') {
          console.log('✅ Using Privy embedded wallet - network switching handled automatically');
          console.log('✅ Proceeding with transaction - Privy will handle network switching');
          // Privy will handle the network switching for embedded wallets
          // We can proceed with the transaction
        } else {
          console.log('⚠️ External wallet detected - manual network switch required');
          throw new Error(`Please manually switch to U2U Nebulas (Chain ID: ${currentNetworkInfo.chainId}) in your wallet. Current chain: ${numericChainId}`);
        }
      } else {
        console.log('✅ Network check passed - on correct network');
      }

      // Validate contract address and data before creating transaction
      if (!contractAddr || !contractAddr.startsWith('0x') || contractAddr.length !== 42) {
        throw new Error(`Invalid contract address: ${contractAddr}`);
      }
      
      if (!data || !data.startsWith('0x')) {
        throw new Error(`Invalid transaction data: ${data}`);
      }
      
      if (!valueHex || !valueHex.startsWith('0x')) {
        throw new Error(`Invalid value: ${valueHex}`);
      }
      
      if (!gasPrice || !gasPrice.startsWith('0x')) {
        throw new Error(`Invalid gas price: ${gasPrice}`);
      }
      
      if (!gasLimit || !gasLimit.startsWith('0x')) {
        throw new Error(`Invalid gas limit: ${gasLimit}`);
      }
      
      // Create transaction objects for different approaches
      const cleanTransaction = {
        to: contractAddr,
        data: data,
        value: valueHex,
        chainId: currentNetworkInfo.chainId,
        gasPrice: gasPrice, // Use legacy gas price for simplicity
        gasLimit: gasLimit
      };
      
      const minimalTransaction = {
        to: contractAddr,
        data: data,
        value: valueHex
      };

      try {
        // CRITICAL: Force U2U network by explicitly setting chainId in transaction
        console.log('🔄 FORCING U2U NEBULAS NETWORK (2484)...');
        console.log('🚨 CRITICAL: Ensuring transaction goes to U2U, NOT Ethereum!');
        
        const u2uTransaction = {
          to: contractAddr,
          data: data,
          value: valueHex || '0x0', // Ensure value is never empty
          chainId: 2484, // HARDCODED U2U Nebulas Chain ID
          gasPrice: '0x3b9aca00', // 1 gwei (1,000,000,000 wei) - meets minimum requirement
          gasLimit: '0x1388' // 5,000 gas limit
        };
        
        console.log('🚨 U2U Transaction (HARDCODED network):', {
          to: u2uTransaction.to,
          data: u2uTransaction.data.substring(0, 20) + '...',
          value: u2uTransaction.value,
          chainId: u2uTransaction.chainId,
          gasPrice: u2uTransaction.gasPrice,
          gasLimit: u2uTransaction.gasLimit,
          network: 'U2U Nebulas (2484) - HARDCODED',
          contractAddr: contractAddr,
          isU2U: u2uTransaction.chainId === 2484,
          gasPriceGwei: parseInt(u2uTransaction.gasPrice, 16) / 1000000000
        });
        
        // Validate all required parameters
        if (!u2uTransaction.to || !u2uTransaction.to.startsWith('0x')) {
          throw new Error('Invalid contract address');
        }
        if (!u2uTransaction.data || !u2uTransaction.data.startsWith('0x')) {
          throw new Error('Invalid transaction data');
        }
        if (!u2uTransaction.value || !u2uTransaction.value.startsWith('0x')) {
          throw new Error('Invalid value');
        }
        if (!u2uTransaction.gasPrice || !u2uTransaction.gasPrice.startsWith('0x')) {
          throw new Error('Invalid gas price');
        }
        if (!u2uTransaction.gasLimit || !u2uTransaction.gasLimit.startsWith('0x')) {
          throw new Error('Invalid gas limit');
        }
        
        // Double-check we're sending to U2U
        if (u2uTransaction.chainId !== 2484) {
          throw new Error(`CRITICAL ERROR: Transaction chainId is ${u2uTransaction.chainId}, expected 2484 (U2U Nebulas)`);
        }
        
        const result = await sendTransaction(u2uTransaction);
        const txHash = result.hash;
        
        console.log('✅ Transaction sent successfully on U2U Nebulas (2484)!', txHash);
        return txHash;
      } catch (simpleError) {
        console.error('Simple transaction failed, trying with explicit gas parameters...', simpleError);
        
        try {
          console.log('🔄 Trying with U2U-forced clean transaction parameters...');
          
          const u2uCleanTransaction = {
            to: contractAddr,
            data: data,
            value: valueHex || '0x0', // Ensure value is never empty
            chainId: 2484, // HARDCODED U2U Nebulas Chain ID
            gasPrice: '0x3b9aca00', // 1 gwei - meets minimum requirement
            gasLimit: '0x1388' // 5,000 gas limit
          };
          
          console.log('U2U Clean Transaction:', {
            ...u2uCleanTransaction,
            chainId: u2uCleanTransaction.chainId,
            network: 'U2U Nebulas (2484)'
          });
          
          const result = await sendTransaction(u2uCleanTransaction);
          const txHash = result.hash;
          
          console.log('✅ Transaction sent with U2U clean parameters:', txHash);
          return txHash;
        } catch (cleanError) {
          console.error('Clean transaction failed, trying with network gas...', cleanError);
          
          // Try with U2U network gas parameters as last resort
          try {
            console.log('🔄 Getting U2U network gas parameters...');
            
            // Use U2U RPC directly instead of wallet provider
            const networkInfo = blockchainService.getNetworkInfo(currentNetwork);
            if (networkInfo) {
              // Get gas price from U2U network
              const gasPriceResponse = await fetch(networkInfo.rpcUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  jsonrpc: '2.0',
                  method: 'eth_gasPrice',
                  params: [],
                  id: 1,
                }),
              });
              
              const gasPriceData = await gasPriceResponse.json();
              const networkGasPrice = gasPriceData.result;
              
              // Get gas estimate from U2U network
              const gasEstimateResponse = await fetch(networkInfo.rpcUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  jsonrpc: '2.0',
                  method: 'eth_estimateGas',
                  params: [{
                    to: contractAddr,
                    data: data,
                    value: valueHex
                  }],
                  id: 1,
                }),
              });
              
              const gasEstimateData = await gasEstimateResponse.json();
              const networkGasEstimate = gasEstimateData.result;
              
              console.log('Network gas parameters:', {
                gasPrice: networkGasPrice,
                gasEstimate: networkGasEstimate,
                gasPriceGwei: parseInt(networkGasPrice, 16) / 1000000000,
                gasEstimateNumber: parseInt(networkGasEstimate, 16)
              });
              
              const u2uNetworkTransaction = {
                to: contractAddr,
                data: data,
                value: valueHex || '0x0', // Ensure value is never empty
                chainId: 2484, // HARDCODED U2U Nebulas Chain ID
                gasPrice: networkGasPrice || '0x3b9aca00', // Use network gas or fallback to 1 gwei
                gasLimit: networkGasEstimate || '0x1388' // Use network estimate or fallback to 5,000
              };
              
              console.log('🔄 U2U Network transaction (forced):', {
                ...u2uNetworkTransaction,
                chainId: u2uNetworkTransaction.chainId,
                network: 'U2U Nebulas (2484)'
              });
              
              const result = await sendTransaction(u2uNetworkTransaction);
              const txHash = result.hash;
              
              console.log('✅ Transaction sent with U2U network parameters:', txHash);
              return txHash;
            }
          } catch (networkError) {
            console.error('Network gas estimation failed:', networkError);
          }
          
          // All attempts failed
          console.error('All transaction attempts failed:', {
            simpleError: simpleError instanceof Error ? simpleError.message : String(simpleError),
            cleanError: cleanError instanceof Error ? cleanError.message : String(cleanError),
            minimalTransaction: minimalTransaction,
            cleanTransaction: cleanTransaction,
            currentNetwork: currentNetwork,
            walletChainId: (user.wallet as any).chainId
          });
          
          throw cleanError;
        }
      }
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

  const getDistributionsByCreator = async (_creator: string): Promise<string[]> => {
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
      
      // Re-initialize with the new network
      if (user?.wallet) {
        const userAddress = user.wallet.address;
        const contractAddr = CONTRACT_ADDRESSES[networkId as keyof typeof CONTRACT_ADDRESSES];
        
        if (contractAddr) {
          setContractAddress(contractAddr);
          await fetchBalance(userAddress);
        }
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
      await fetchBalance(address);
    }
  };

  const value: ContractContextType = {
    isConnected,
    isInitialized,
    address,
    balance,
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
    isLoading,
    error,
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