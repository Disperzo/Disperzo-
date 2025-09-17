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

      console.log('Creating distribution with Privy wallet:', {
        erc20Transfers,
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
      console.log('Input parameters:', {
        erc20Transfers: erc20Transfers,
        erc721Transfers: params.erc721Transfers || [],
        erc1155Transfers: params.erc1155Transfers || [],
        name: name,
        description: description
      });
      
      let data;
      let functionName;
      let functionArgs;
      
      // Always use mixedBulkTransfer for now to handle all cases
      functionName = 'mixedBulkTransfer';
      functionArgs = [
        erc20Transfers,
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
      
      try {
        data = contract.interface.encodeFunctionData(functionName, functionArgs);
        console.log('✅ Function encoding successful:', {
          functionName: functionName,
          selector: data.substring(0, 10),
          actualSelector: functionFragment.selector,
          expectedSelector: '0x0c95d02a', // Expected selector for mixedBulkTransfer
          selectorMatch: data.substring(0, 10) === '0x0c95d02a',
          args: functionArgs,
          erc20TransfersLength: erc20Transfers.length,
          erc721TransfersLength: (params.erc721Transfers || []).length,
          erc1155TransfersLength: (params.erc1155Transfers || []).length,
          dataLength: data.length
        });
        
        // Verify the function selector is correct
        if (data.substring(0, 10) !== '0x0c95d02a') {
          console.warn('⚠️ Function selector mismatch! Expected: 0x0c95d02a, Got:', data.substring(0, 10));
        }
      } catch (encodingError) {
        console.error('❌ Function encoding failed:', encodingError);
        console.error('Encoding error details:', {
          functionName: functionName,
          functionArgs: functionArgs,
          error: encodingError
        });
        throw new Error(`Failed to encode function ${functionName}: ${(encodingError as any)?.message || 'Unknown encoding error'}`);
      }
      
      console.log('Function encoding complete:', {
        functionName: functionName,
        dataLength: data.length,
        selector: data.substring(0, 10),
        encodedData: data
      });
      
      // Test: Try a simple transaction first to verify contract is working
      console.log('🧪 Testing contract interaction...');
      try {
        // Try to call a simple view function first
        const testContract = new ethers.Contract(contractAddr, DISPERZO_CORE_ABI);
        console.log('✅ Contract instance created successfully');
        console.log('Contract address:', contractAddr);
        console.log('Contract ABI functions:', availableFunctions.map(f => f.name));
        
        // Test if we can call a simple view function
        try {
          const totalDistributions = await testContract.getTotalDistributions();
          console.log('✅ Contract call successful, total distributions:', totalDistributions.toString());
        } catch (viewError) {
          console.warn('⚠️ View function call failed (this might be expected):', (viewError as any)?.message || 'Unknown view error');
        }
      } catch (testError) {
        console.error('❌ Contract test failed:', testError);
        throw new Error(`Contract interaction test failed: ${(testError as any)?.message || 'Unknown test error'}`);
      }

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
      const testValue = value === '0' ? '0' : '0.001'; // Use 0.001 ETH for testing
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
        testValue: testValue,
        wei: valueInWei.toString(),
        hex: valueHex,
        isSafe: valueInWei <= maxSafeValue
      });
      
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
      // Transaction objects will be created dynamically in the gas strategies loop

      try {
        // CRITICAL: Force U2U network by explicitly setting chainId in transaction
        console.log('🔄 FORCING U2U NEBULAS NETWORK (2484)...');
        console.log('🚨 CRITICAL: Ensuring transaction goes to U2U, NOT Ethereum!');
        console.log('🚨 TRANSACTION DEBUG: About to try gas strategies...');
        
        // Pre-flight checks
        console.log('🔍 Pre-flight checks:');
        console.log('- User authenticated:', !!user);
        console.log('- Wallet connected:', !!user?.wallet);
        console.log('- Wallet address:', user?.wallet?.address);
        console.log('- Wallet type:', user?.wallet?.connectorType);
        console.log('- Current network:', currentNetwork);
        console.log('- Contract address:', contractAddr);
        console.log('- Data length:', data.length);
        console.log('- Data preview:', data.substring(0, 50) + '...');
        
        // Check wallet balance
        try {
          const balance = await (user?.wallet as any)?.getBalance?.();
          console.log('💰 Wallet balance:', balance?.toString(), 'wei');
          console.log('💰 Wallet balance U2U:', balance ? (Number(balance) / 1e18).toFixed(6) : 'unknown');
          
          if (!balance || Number(balance) < 1000000000000000000n) { // Less than 1 U2U
            console.warn('⚠️ Low balance detected! Balance might be insufficient for gas fees.');
          }
        } catch (balanceError) {
          console.warn('⚠️ Could not check wallet balance:', balanceError);
        }
        
        // Verify contract exists
        try {
          const networkInfo = blockchainService.getNetworkInfo(currentNetwork);
          if (networkInfo) {
            const contractCodeResponse = await fetch(networkInfo.rpcUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_getCode',
                params: [contractAddr, 'latest'],
                id: 1,
              }),
            });
            
            const contractCodeData = await contractCodeResponse.json();
            const contractCode = contractCodeData.result;
            
            console.log('📋 Contract verification:');
            console.log('- Contract address:', contractAddr);
            console.log('- Contract code length:', contractCode.length);
            console.log('- Contract deployed:', contractCode !== '0x' && contractCode.length > 2);
            
            if (contractCode === '0x' || contractCode.length <= 2) {
              throw new Error(`Contract not deployed at address ${contractAddr}`);
            }
          }
        } catch (contractError) {
          console.error('❌ Contract verification failed:', contractError);
          throw new Error(`Contract verification failed: ${contractError}`);
        }
        
        // Test basic contract interaction first
        try {
          console.log('🧪 Testing basic contract interaction...');
          const testData = contract.interface.encodeFunctionData('getTotalDistributions', []);
          const testTransaction = {
            to: contractAddr,
            data: testData,
            value: 0n,
            chainId: 2484,
            gasPrice: 1000001000n, // U2U minimum
            gasLimit: 100000n // Low gas for simple call
          };
          
          console.log('🧪 Test transaction:', {
            to: testTransaction.to,
            data: testTransaction.data.substring(0, 20) + '...',
            value: testTransaction.value.toString(),
            chainId: testTransaction.chainId,
            gasPrice: testTransaction.gasPrice.toString(),
            gasLimit: testTransaction.gasLimit.toString()
          });
          
          // This is a call, not a transaction, so it should work
          const networkInfo = blockchainService.getNetworkInfo(currentNetwork);
          if (networkInfo) {
            const callResponse = await fetch(networkInfo.rpcUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_call',
                params: [{
                  to: contractAddr,
                  data: testData
                }, 'latest'],
                id: 1,
              }),
            });
            
            const callData = await callResponse.json();
            console.log('🧪 Contract call result:', callData);
            
            if (callData.error) {
              console.error('❌ Contract call failed:', callData.error);
              throw new Error(`Contract call failed: ${callData.error.message}`);
            } else {
              console.log('✅ Contract interaction test passed!');
            }
          }
        } catch (testError) {
          console.error('❌ Contract interaction test failed:', testError);
          // Don't throw here, continue with transaction attempts
        }
        
        // Try direct RPC approach first - bypass Privy's sendTransaction
        try {
          console.log('🔄 Attempting direct RPC transaction approach...');
          
          const networkInfo = blockchainService.getNetworkInfo(currentNetwork);
          if (networkInfo) {
            // Get current nonce
            const nonceResponse = await fetch(networkInfo.rpcUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_getTransactionCount',
                params: [user.wallet.address, 'latest'],
                id: 1,
              }),
            });
            
            const nonceData = await nonceResponse.json();
            const nonce = nonceData.result;
            
            // Get current gas price with fallback
            let networkGasPrice = '0x3b9aca0'; // Default to 1 gwei if network call fails
            try {
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
              console.log('📊 Gas price response:', gasPriceData);
              
              if (gasPriceData.result && gasPriceData.result !== '0x0') {
                networkGasPrice = gasPriceData.result;
                console.log('✅ Gas price fetched:', networkGasPrice);
              } else {
                console.warn('⚠️ Gas price fetch failed, using default:', networkGasPrice);
              }
            } catch (gasPriceError) {
              console.warn('⚠️ Gas price error, using default:', gasPriceError);
            }
            
            // Ensure gas price meets U2U minimum (1.000001 gwei = 0x3b9aca1)
            const minGasPrice = '0x3b9aca1'; // 1.000001 gwei in hex
            if (parseInt(networkGasPrice, 16) < parseInt(minGasPrice, 16)) {
              console.log('🔧 Adjusting gas price to meet U2U minimum');
              networkGasPrice = minGasPrice;
            }
            
            // Estimate gas with proper error handling
            let gasEstimate = '0x2dc6c0'; // Default to 3M gas if estimation fails
            try {
              const gasEstimateResponse = await fetch(networkInfo.rpcUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  jsonrpc: '2.0',
                  method: 'eth_estimateGas',
                  params: [{
                    from: user.wallet.address,
                    to: contractAddr,
                    data: data,
                    value: '0x0'
                  }],
                  id: 1,
                }),
              });
              
              const gasEstimateData = await gasEstimateResponse.json();
              console.log('📊 Gas estimate response:', gasEstimateData);
              
              if (gasEstimateData.result && gasEstimateData.result !== '0x') {
                gasEstimate = gasEstimateData.result;
                console.log('✅ Gas estimation successful:', gasEstimate);
              } else {
                console.warn('⚠️ Gas estimation failed, using default:', gasEstimate);
              }
            } catch (gasError) {
              console.warn('⚠️ Gas estimation error, using default:', gasError);
            }
            
            console.log('📊 Network parameters:', {
              nonce: nonce,
              networkGasPrice: networkGasPrice,
              gasEstimate: gasEstimate,
              networkGasPriceGwei: parseInt(networkGasPrice, 16) / 1000000000,
              gasEstimateNumber: parseInt(gasEstimate, 16)
            });
            
            // Create transaction object with safe gas limit calculation
            const gasEstimateNum = parseInt(gasEstimate, 16);
            const safeGasLimit = gasEstimateNum > 0 ? gasEstimateNum * 2 : 3000000; // 3M gas default
            const gasLimitHex = `0x${safeGasLimit.toString(16)}`;
            
            const transaction = {
              from: user.wallet.address,
              to: contractAddr,
              nonce: nonce,
              gasPrice: networkGasPrice,
              gasLimit: gasLimitHex,
              value: '0x0',
              data: data,
              chainId: '0x9b4' // 2484 in hex
            };
            
            console.log('🚨 Direct RPC transaction object:', {
              from: transaction.from,
              to: transaction.to,
              nonce: transaction.nonce,
              gasPrice: transaction.gasPrice,
              gasLimit: transaction.gasLimit,
              value: transaction.value,
              data: transaction.data.substring(0, 20) + '...',
              chainId: transaction.chainId
            });
            
            // Try to sign and send the transaction using Privy's wallet
            try {
              console.log('🔄 Attempting to sign transaction with Privy wallet...');
              
              // Use Privy's wallet to sign the transaction
              const signedTx = await (user.wallet as any).signTransaction?.(transaction);
              
              if (signedTx) {
                console.log('✅ Transaction signed successfully!');
                
                // Send the signed transaction
                const sendResponse = await fetch(networkInfo.rpcUrl, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'eth_sendRawTransaction',
                    params: [signedTx],
                    id: 1,
                  }),
                });
                
                const sendData = await sendResponse.json();
                console.log('📝 Send transaction response:', sendData);
                
                if (sendData.result) {
                  console.log('✅ Transaction sent successfully via direct RPC!', sendData.result);
                  return sendData.result;
                } else {
                  console.error('❌ Direct RPC transaction failed:', sendData.error);
                }
              } else {
                console.warn('⚠️ Could not sign transaction with Privy wallet');
              }
            } catch (signError) {
              console.error('❌ Transaction signing failed:', signError);
            }
          }
        } catch (rpcError) {
          console.error('❌ Direct RPC approach failed:', rpcError);
        }
        
        // Try Privy's wallet methods directly
        try {
          console.log('🔄 Trying Privy wallet methods directly...');
          
          // Try using Privy's wallet provider directly
          const provider = (user.wallet as any)?.provider;
          if (provider) {
            console.log('📱 Found Privy wallet provider, attempting direct transaction...');
            
            const directTransaction = {
              to: contractAddr,
              data: data,
              value: '0x0',
              gasPrice: '0x3b9aca1', // 1.000001 gwei in hex - meets U2U minimum
              gasLimit: '0x2dc6c0' // 3M gas in hex
            };
            
            console.log('🚨 Direct provider transaction:', {
              to: directTransaction.to,
              data: directTransaction.data.substring(0, 20) + '...',
              value: directTransaction.value,
              gasPrice: directTransaction.gasPrice,
              gasLimit: directTransaction.gasLimit
            });
            
            try {
              const txHash = await provider.request({
                method: 'eth_sendTransaction',
                params: [directTransaction]
              });
              
              if (txHash) {
                console.log('✅ Transaction sent via provider.request!', txHash);
                return txHash;
              }
            } catch (providerError) {
              console.error('❌ Provider request failed:', providerError);
            }
          }
          
          // Try using Privy's wallet sendTransaction with minimal parameters
          console.log('🔄 Trying Privy sendTransaction with minimal parameters...');
          
          const minimalTransaction = {
            to: contractAddr,
            data: data,
            value: 0n,
            chainId: 2484,
            gasPrice: 1000001000n, // 1.000001 gwei - meets U2U minimum
            gasLimit: 3000000n // 3M gas - safe limit
          };
          
          console.log('🚨 Minimal transaction (Privy handles gas):', {
            to: minimalTransaction.to,
            data: minimalTransaction.data.substring(0, 20) + '...',
            value: minimalTransaction.value.toString(),
            chainId: minimalTransaction.chainId
          });
          
          const result = await sendTransaction(minimalTransaction);
          if (result?.hash) {
            console.log('✅ Minimal transaction successful!', result.hash);
            return result.hash;
          }
          
        } catch (directError) {
          console.error('❌ Direct Privy methods failed:', directError);
        }
        
        // Try using ethers.js directly with Privy's wallet
        try {
          console.log('🔄 Trying ethers.js direct approach...');
          
          // Import ethers if not already available
          const { ethers } = await import('ethers');
          
          // Get the provider from Privy's wallet
          const provider = (user.wallet as any)?.provider;
          if (provider) {
            console.log('📱 Using ethers with Privy provider...');
            
            // Create ethers provider and signer
            const ethersProvider = new ethers.BrowserProvider(provider);
            const signer = await ethersProvider.getSigner();
            
            console.log('🔐 Ethers signer created:', {
              address: await signer.getAddress(),
              chainId: (await ethersProvider.getNetwork()).chainId
            });
            
            // Create transaction with ethers
            const ethersTransaction = {
              to: contractAddr,
              data: data,
              value: 0n,
              gasPrice: 1000001000n, // 1.000001 gwei
              gasLimit: 3000000n // 3M gas
            };
            
            console.log('🚨 Ethers transaction:', {
              to: ethersTransaction.to,
              data: ethersTransaction.data.substring(0, 20) + '...',
              value: ethersTransaction.value.toString(),
              gasPrice: ethersTransaction.gasPrice.toString(),
              gasLimit: ethersTransaction.gasLimit.toString()
            });
            
            try {
              const txResponse = await signer.sendTransaction(ethersTransaction);
              console.log('✅ Ethers transaction sent!', txResponse.hash);
              
              // Wait for confirmation
              const receipt = await txResponse.wait();
              console.log('✅ Ethers transaction confirmed!', receipt);
              
              return txResponse.hash;
            } catch (ethersError) {
              console.error('❌ Ethers transaction failed:', ethersError);
            }
          }
        } catch (ethersError) {
          console.error('❌ Ethers approach failed:', ethersError);
        }
        
        // Fallback to Privy's sendTransaction with multiple strategies
        console.log('🔄 Falling back to Privy sendTransaction with multiple strategies...');
        
        const gasStrategies = [
          {
            name: 'U2U Minimum Gas Strategy',
            gasPrice: 1000001000n, // 1.000001 gwei - meets U2U minimum requirement
            gasLimit: 3000000n, // 3M gas - very high limit
            type: 0 // Legacy transaction type
          },
          {
            name: 'U2U Safe Gas Strategy',
            gasPrice: 2000000000n, // 2 gwei - safe margin above minimum
            gasLimit: 3000000n, // 3M gas
            type: 0 // Legacy transaction type
          },
          {
            name: 'EIP-1559 Strategy',
            maxFeePerGas: 3000000000n, // 3 gwei
            maxPriorityFeePerGas: 2000000000n, // 2 gwei
            gasLimit: 3000000n, // 3M gas
            type: 2 // EIP-1559 transaction type
          },
          {
            name: 'High Gas Strategy',
            gasPrice: 5000000000n, // 5 gwei - very safe
            gasLimit: 2000000n, // 2M gas
            type: 0 // Legacy transaction type
          }
        ];
        
        for (const strategy of gasStrategies) {
          try {
            console.log(`🔄 Trying ${strategy.name}...`);
            console.log(`📊 Strategy details:`, {
              name: strategy.name,
              gasPrice: strategy.gasPrice?.toString(),
              maxFeePerGas: strategy.maxFeePerGas?.toString(),
              maxPriorityFeePerGas: strategy.maxPriorityFeePerGas?.toString(),
              gasLimit: strategy.gasLimit?.toString(),
              type: strategy.type
            });
            
            // Create transaction based on strategy type
            let u2uTransaction: any = {
              to: contractAddr,
              data: data,
              value: 0n, // BigInt zero
              chainId: 2484, // HARDCODED U2U Nebulas Chain ID
            };
            
            if (strategy.type === 2) {
              // EIP-1559 transaction
              u2uTransaction = {
                ...u2uTransaction,
                maxFeePerGas: strategy.maxFeePerGas,
                maxPriorityFeePerGas: strategy.maxPriorityFeePerGas,
                gasLimit: strategy.gasLimit,
                type: 2
              };
            } else {
              // Legacy transaction
              u2uTransaction = {
                ...u2uTransaction,
                gasPrice: strategy.gasPrice,
                gasLimit: strategy.gasLimit,
                type: 0
              };
            }
        
            // Log transaction details based on type
            const logData: any = {
              to: u2uTransaction.to,
              data: u2uTransaction.data.substring(0, 20) + '...',
              value: u2uTransaction.value.toString(),
              chainId: u2uTransaction.chainId,
              gasLimit: u2uTransaction.gasLimit.toString(),
              gasLimitNumber: Number(u2uTransaction.gasLimit),
              type: u2uTransaction.type,
              network: 'U2U Nebulas (2484) - HARDCODED',
              contractAddr: contractAddr,
              isU2U: u2uTransaction.chainId === 2484
            };
            
            if (u2uTransaction.type === 2) {
              // EIP-1559 transaction
              logData.maxFeePerGas = u2uTransaction.maxFeePerGas.toString();
              logData.maxPriorityFeePerGas = u2uTransaction.maxPriorityFeePerGas.toString();
              logData.maxFeePerGasGwei = Number(u2uTransaction.maxFeePerGas) / 1000000000;
              logData.maxPriorityFeePerGasGwei = Number(u2uTransaction.maxPriorityFeePerGas) / 1000000000;
            } else {
              // Legacy transaction
              logData.gasPrice = u2uTransaction.gasPrice.toString();
              logData.gasPriceGwei = Number(u2uTransaction.gasPrice) / 1000000000;
            }
            
            console.log(`🚨 U2U Transaction (${strategy.name}):`, logData);
            
            // Double-check we're sending to U2U
            if (u2uTransaction.chainId !== 2484) {
              throw new Error(`CRITICAL ERROR: Transaction chainId is ${u2uTransaction.chainId}, expected 2484 (U2U Nebulas)`);
            }
            
            // Safety check: Ensure total fee is reasonable
            const gasLimitNum = Number(u2uTransaction.gasLimit);
            let totalFeeWei: number;
            let feeDetails: any;
            
            if (u2uTransaction.type === 2) {
              // EIP-1559 transaction
              const maxFeePerGasNum = Number(u2uTransaction.maxFeePerGas);
              totalFeeWei = maxFeePerGasNum * gasLimitNum;
              feeDetails = {
                strategy: strategy.name,
                maxFeePerGasWei: maxFeePerGasNum,
                maxPriorityFeePerGasWei: Number(u2uTransaction.maxPriorityFeePerGas),
                gasLimit: gasLimitNum,
                totalFeeWei: totalFeeWei,
                totalFeeU2U: totalFeeWei / 1e18,
                isReasonable: (totalFeeWei / 1e18) < 100
              };
            } else {
              // Legacy transaction
              const gasPriceNum = Number(u2uTransaction.gasPrice);
              totalFeeWei = gasPriceNum * gasLimitNum;
              feeDetails = {
                strategy: strategy.name,
                gasPriceWei: gasPriceNum,
                gasLimit: gasLimitNum,
                totalFeeWei: totalFeeWei,
                totalFeeU2U: totalFeeWei / 1e18,
                isReasonable: (totalFeeWei / 1e18) < 100
              };
            }
            
            console.log('Fee calculation:', feeDetails);
            
            if ((totalFeeWei / 1e18) > 100) {
              throw new Error(`Fee too high: ${totalFeeWei / 1e18} U2U. Gas limit: ${gasLimitNum}`);
            }
            
            // Log final transaction details
            const finalLogData: any = {
              to: u2uTransaction.to,
              data: u2uTransaction.data.substring(0, 20) + '...',
              value: u2uTransaction.value.toString(),
              chainId: u2uTransaction.chainId,
              gasLimit: u2uTransaction.gasLimit.toString(),
              type: u2uTransaction.type
            };
            
            if (u2uTransaction.type === 2) {
              finalLogData.maxFeePerGas = u2uTransaction.maxFeePerGas.toString();
              finalLogData.maxPriorityFeePerGas = u2uTransaction.maxPriorityFeePerGas.toString();
            } else {
              finalLogData.gasPrice = u2uTransaction.gasPrice.toString();
            }
            
            console.log(`🚨 SENDING TRANSACTION with ${strategy.name}:`, finalLogData);
            
            // Add comprehensive error handling for sendTransaction
            let result;
            try {
              console.log(`🚀 Calling sendTransaction with:`, {
                to: u2uTransaction.to,
                data: u2uTransaction.data.substring(0, 20) + '...',
                value: u2uTransaction.value.toString(),
                chainId: u2uTransaction.chainId,
                gasPrice: u2uTransaction.gasPrice?.toString(),
                maxFeePerGas: u2uTransaction.maxFeePerGas?.toString(),
                maxPriorityFeePerGas: u2uTransaction.maxPriorityFeePerGas?.toString(),
                gasLimit: u2uTransaction.gasLimit?.toString(),
                type: u2uTransaction.type
              });
              
              result = await sendTransaction(u2uTransaction);
              console.log(`📝 sendTransaction result:`, result);
              
              if (!result || !result.hash) {
                throw new Error(`sendTransaction returned invalid result: ${JSON.stringify(result)}`);
              }
              
              const txHash = result.hash;
              console.log(`✅ Transaction sent successfully with ${strategy.name} on U2U Nebulas (2484)!`, txHash);
              return txHash;
              
            } catch (sendError) {
              console.error(`❌ sendTransaction failed for ${strategy.name}:`, sendError);
              console.error(`❌ sendTransaction error details:`, {
                message: (sendError as any)?.message,
                code: (sendError as any)?.code,
                reason: (sendError as any)?.reason,
                data: (sendError as any)?.data,
                transaction: (sendError as any)?.transaction,
                error: (sendError as any)?.error,
                cause: (sendError as any)?.cause,
                stack: (sendError as any)?.stack
              });
              
              // Re-throw to be caught by outer try-catch
              throw sendError;
            }
            
          } catch (strategyError) {
            console.error(`❌ ${strategy.name} failed:`, strategyError);
            console.error('Strategy error details:', {
              message: (strategyError as any)?.message,
              code: (strategyError as any)?.code,
              details: (strategyError as any)?.details,
              cause: (strategyError as any)?.cause
            });
            
            if (strategy === gasStrategies[gasStrategies.length - 1]) {
              // This was the last strategy, try network gas estimation as final fallback
              console.log('🔄 All strategies failed, trying network gas estimation...');
              try {
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
                  const networkGasPrice = BigInt(gasPriceData.result);
                  
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
                        value: '0x0'
                      }],
                      id: 1,
                    }),
                  });
                  
                  const gasEstimateData = await gasEstimateResponse.json();
                  const networkGasEstimate = BigInt(gasEstimateData.result);
                  
                  console.log('Network gas parameters:', {
                    gasPrice: networkGasPrice.toString(),
                    gasEstimate: networkGasEstimate.toString(),
                    gasPriceGwei: Number(networkGasPrice) / 1000000000,
                    gasEstimateNumber: Number(networkGasEstimate)
                  });
                  
                  const networkTransaction = {
                    to: contractAddr,
                    data: data,
                    value: 0n,
                    chainId: 2484,
                    gasPrice: networkGasPrice || 1000001000n, // Use network gas or U2U minimum
                    gasLimit: (networkGasEstimate || 3000000n) * 2n // Add 100% buffer
                  };
                  
                  console.log('🔄 Trying network-estimated transaction...');
                  console.log('🚨 SENDING NETWORK TRANSACTION:', {
                    to: networkTransaction.to,
                    data: networkTransaction.data.substring(0, 20) + '...',
                    value: networkTransaction.value.toString(),
                    chainId: networkTransaction.chainId,
                    gasPrice: networkTransaction.gasPrice.toString(),
                    gasLimit: networkTransaction.gasLimit.toString()
                  });
                  
                  const result = await sendTransaction(networkTransaction);
                  const txHash = result.hash;
                  
                  console.log('✅ Transaction sent with network gas estimation:', txHash);
                  return txHash;
                }
              } catch (networkError) {
                console.error('❌ Network gas estimation also failed:', networkError);
              }
              
              // All attempts failed, try one final simple approach
              console.log('🔄 All strategies failed, trying final simple approach...');
              try {
                const simpleTransaction = {
                  to: contractAddr,
                  data: data,
                  value: 0n,
                  chainId: 2484
                  // Let Privy handle gas estimation
                };
                
                console.log('🚨 SENDING SIMPLE TRANSACTION (Privy handles gas):', {
                  to: simpleTransaction.to,
                  data: simpleTransaction.data.substring(0, 20) + '...',
                  value: simpleTransaction.value.toString(),
                  chainId: simpleTransaction.chainId
                });
                
                const result = await sendTransaction(simpleTransaction);
                const txHash = result.hash;
                
                console.log('✅ Transaction sent with simple approach:', txHash);
                return txHash;
              } catch (simpleError) {
                console.error('❌ Simple approach also failed:', simpleError);
              }
              
              // All attempts failed
              throw strategyError;
            }
            // Continue to next strategy
            continue;
          }
        }
      } catch (simpleError) {
        console.error('Full error details:', {
          message: (simpleError as any)?.message,
          code: (simpleError as any)?.code,
          details: (simpleError as any)?.details,
          cause: (simpleError as any)?.cause
        });
        console.error('Simple transaction failed, trying with explicit gas parameters...', simpleError);
        
        try {
          console.log('🔄 Trying with U2U-forced clean transaction parameters...');
          
          const u2uCleanTransaction = {
            to: contractAddr,
            data: data,
            value: 0n, // BigInt zero
            chainId: 2484, // HARDCODED U2U Nebulas Chain ID
            gasPrice: 1000001000n, // 1.000001 gwei - meets U2U minimum requirement
            gasLimit: 3000000n // 3M gas limit as BigInt - high enough for complex function
          };
          
          console.log('U2U Clean Transaction:', {
            ...u2uCleanTransaction,
            chainId: u2uCleanTransaction.chainId,
            network: 'U2U Nebulas (2484)'
          });
          
          console.log('🚨 SENDING CLEAN TRANSACTION:', {
            to: u2uCleanTransaction.to,
            data: u2uCleanTransaction.data.substring(0, 20) + '...',
            value: u2uCleanTransaction.value.toString(),
            chainId: u2uCleanTransaction.chainId,
            gasPrice: u2uCleanTransaction.gasPrice.toString(),
            gasLimit: u2uCleanTransaction.gasLimit.toString()
          });
          
          const result = await sendTransaction(u2uCleanTransaction);
          const txHash = result.hash;
          
          console.log('✅ Transaction sent with U2U clean parameters:', txHash);
          return txHash;
        } catch (cleanError) {
          console.error('Full error details (clean):', {
            message: (cleanError as any)?.message,
            code: (cleanError as any)?.code,
            details: (cleanError as any)?.details,
            cause: (cleanError as any)?.cause
          });
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
                value: 0n, // BigInt zero
                chainId: 2484, // HARDCODED U2U Nebulas Chain ID
                gasPrice: networkGasPrice ? BigInt(networkGasPrice) : 1000001000n, // Use network gas or fallback to U2U minimum
                gasLimit: networkGasEstimate ? BigInt(networkGasEstimate) : 3000000n // Use network estimate or fallback to 3M
              };
              
              console.log('🔄 U2U Network transaction (forced):', {
                ...u2uNetworkTransaction,
                chainId: u2uNetworkTransaction.chainId,
                network: 'U2U Nebulas (2484)'
              });
              
              console.log('🚨 SENDING FINAL NETWORK TRANSACTION:', {
                to: u2uNetworkTransaction.to,
                data: u2uNetworkTransaction.data.substring(0, 20) + '...',
                value: u2uNetworkTransaction.value.toString(),
                chainId: u2uNetworkTransaction.chainId,
                gasPrice: u2uNetworkTransaction.gasPrice.toString(),
                gasLimit: u2uNetworkTransaction.gasLimit.toString()
              });
              
              const result = await sendTransaction(u2uNetworkTransaction);
              const txHash = result.hash;
              
              console.log('✅ Transaction sent with U2U network parameters:', txHash);
              return txHash;
            }
          } catch (networkError) {
            console.error('Full error details (network):', {
              message: (networkError as any)?.message,
              code: (networkError as any)?.code,
              details: (networkError as any)?.details,
              cause: (networkError as any)?.cause
            });
            console.error('Network gas estimation failed:', networkError);
          }
          
          // All attempts failed - provide comprehensive error summary
          const errorSummary = {
            message: 'All transaction strategies failed',
            strategiesAttempted: 4, // We have 4 gas strategies
            errors: {
              simpleError: simpleError instanceof Error ? simpleError.message : String(simpleError),
              cleanError: cleanError instanceof Error ? cleanError.message : String(cleanError),
              networkError: 'Network error details in console logs'
            },
            userInfo: {
              authenticated: !!user,
              walletConnected: !!user?.wallet,
              walletAddress: user?.wallet?.address,
              walletType: user?.wallet?.connectorType,
              currentNetwork: currentNetwork,
              walletChainId: (user.wallet as any).chainId
            },
            transactionInfo: {
              contractAddress: contractAddr,
              dataLength: data.length,
              dataPreview: data.substring(0, 50) + '...',
              chainId: 2484
            },
            recommendations: [
              'Check wallet balance - ensure sufficient U2U for gas fees',
              'Verify network connection to U2U Nebulas',
              'Check if contract is properly deployed',
              'Try increasing gas price and gas limit',
              'Check browser console for detailed error logs'
            ]
          };
          
          console.error('🚨 COMPREHENSIVE ERROR SUMMARY:', errorSummary);
          
          // Final attempt: Try direct RPC transaction
          try {
            console.log('🔄 Final attempt: Direct RPC transaction...');
            
            const networkInfo = blockchainService.getNetworkInfo(currentNetwork);
            if (networkInfo) {
              // Get nonce
              const nonceResponse = await fetch(networkInfo.rpcUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  jsonrpc: '2.0',
                  method: 'eth_getTransactionCount',
                  params: [user.wallet.address, 'latest'],
                  id: 1,
                }),
              });
              
              const nonceData = await nonceResponse.json();
              const nonce = nonceData.result;
              
              console.log('📊 Direct RPC transaction details:', {
                from: user.wallet.address,
                to: contractAddr,
                nonce: nonce,
                gasPrice: '0x3b9aca0', // 1 gwei in hex
                gasLimit: '0x2dc6c0', // 3M gas in hex
                value: '0x0',
                data: data.substring(0, 20) + '...',
                chainId: '0x9b4' // 2484 in hex
              });
              
              // This would require signing the transaction, which is complex
              // For now, just log the attempt
              console.log('⚠️ Direct RPC transaction requires transaction signing - not implemented in this fallback');
            }
          } catch (rpcError) {
            console.error('❌ Direct RPC transaction failed:', rpcError);
          }
          
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
    
    // This should never be reached, but satisfies TypeScript
    throw new Error('Unexpected end of createDistribution function');
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