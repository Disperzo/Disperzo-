import React, { useState, useEffect } from 'react';
import { X, Mail, MapPin, Users, Upload, ArrowRight, Clock, Coins } from 'lucide-react';
import Notification from './Notification';
import { useContract } from '../contexts/ContractContext';
import { TEST_TOKEN_ADDRESSES } from '../contracts/DisperzoCore';
import { readContract, writeContract } from '@wagmi/core';
import { formatUnits, parseUnits, parseEther } from 'viem';
import { config } from '../config/wagmi';
import { usePrivy } from '@privy-io/react-auth';

interface SendModalProps {
  onClose: () => void;
}

interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
}

const SendModal: React.FC<SendModalProps> = ({ onClose }) => {
  const [sendMethod, setSendMethod] = useState<'email' | 'address' | 'multiple'>('address');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [selectedToken, setSelectedToken] = useState<string>('U2U');
  const [availableTokens, setAvailableTokens] = useState<TokenInfo[]>([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);

  const { isConnected, address, balance } = useContract();
  const { sendTransaction } = usePrivy();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const sendMethods = [
    {
      id: 'email',
      title: 'Send to Email',
      description: 'Send money to someone using their email address',
      icon: Mail,
      placeholder: 'Enter email address',
      comingSoon: true
    },
    {
      id: 'address',
      title: 'Send to Address',
      description: 'Send money to a specific wallet address',
      icon: MapPin,
      placeholder: 'Enter wallet address',
      comingSoon: false
    },
    {
      id: 'multiple',
      title: 'Send to Multiple',
      description: 'Send money to multiple recipients via CSV',
      icon: Users,
      placeholder: 'Upload CSV file',
      comingSoon: true
    }
  ];

  const currentMethod = sendMethods.find(method => method.id === sendMethod);

  // Load available tokens when component mounts
  useEffect(() => {
    const loadTokens = async () => {
      if (!isConnected || !address) return;
      
      setIsLoadingTokens(true);
      try {
        const tokens: TokenInfo[] = [];
        
        // Add U2U native token
        if (balance) {
          tokens.push({
            address: 'native',
            symbol: 'U2U',
            name: 'U2U',
            decimals: 18,
            balance: balance
          });
        }
        
        // Add test ERC20 token
        const testTokenAddress = TEST_TOKEN_ADDRESSES['u2u-nebulas'].erc20;
        try {
          const [symbol, name, decimals, tokenBalance] = await Promise.all([
            readContract(config, {
              address: testTokenAddress as `0x${string}`,
              abi: [
                {
                  "type": "function",
                  "name": "symbol",
                  "stateMutability": "view",
                  "inputs": [],
                  "outputs": [{"type": "string"}]
                }
              ],
              functionName: 'symbol'
            }),
            readContract(config, {
              address: testTokenAddress as `0x${string}`,
              abi: [
                {
                  "type": "function",
                  "name": "name",
                  "stateMutability": "view",
                  "inputs": [],
                  "outputs": [{"type": "string"}]
                }
              ],
              functionName: 'name'
            }),
            readContract(config, {
              address: testTokenAddress as `0x${string}`,
              abi: [
                {
                  "type": "function",
                  "name": "decimals",
                  "stateMutability": "view",
                  "inputs": [],
                  "outputs": [{"type": "uint8"}]
                }
              ],
              functionName: 'decimals'
            }),
            readContract(config, {
              address: testTokenAddress as `0x${string}`,
              abi: [
                {
                  "type": "function",
                  "name": "balanceOf",
                  "stateMutability": "view",
                  "inputs": [{"type": "address"}],
                  "outputs": [{"type": "uint256"}]
                }
              ],
              functionName: 'balanceOf',
              args: [address as `0x${string}`]
            })
          ]);
          
          const formattedBalance = formatUnits(tokenBalance as bigint, decimals as number);
          
          tokens.push({
            address: testTokenAddress,
            symbol: symbol as string,
            name: name as string,
            decimals: decimals as number,
            balance: formattedBalance
          });
        } catch (error) {
          console.log('Could not load test token info:', error);
        }
        
        setAvailableTokens(tokens);
      } catch (error) {
        console.error('Error loading tokens:', error);
      } finally {
        setIsLoadingTokens(false);
      }
    };
    
    loadTokens();
  }, [isConnected, address, balance]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleSend = async () => {
    if (!amount || (sendMethod === 'multiple' ? !selectedFile : !recipient)) return;
    
    // Check if user is connected
    if (!isConnected || !address) {
      setNotificationType('error');
      setNotificationMessage('Please connect your wallet first');
      setShowNotification(true);
      return;
    }

    // Validate address format for address method
    if (sendMethod === 'address' && !/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
      setNotificationType('error');
      setNotificationMessage('Please enter a valid wallet address');
      setShowNotification(true);
      return;
    }
    
    setIsSending(true);
    
    try {
      const selectedTokenInfo = availableTokens.find(token => token.symbol === selectedToken);
      if (!selectedTokenInfo) {
        throw new Error('Selected token not found');
      }

      // Check if user has sufficient balance
      const userBalance = parseFloat(selectedTokenInfo.balance);
      const sendAmount = parseFloat(amount);
      
      if (userBalance < sendAmount) {
        setNotificationType('error');
        setNotificationMessage(`Insufficient balance. You have ${selectedTokenInfo.balance} ${selectedTokenInfo.symbol}`);
        setShowNotification(true);
        setIsSending(false);
        return;
      }

      let txHash: string;

      if (selectedTokenInfo.address === 'native') {
        // Send native U2U token using Privy's sendTransaction
        console.log(`Sending ${amount} U2U to ${recipient}`);
        
        const valueInWei = parseEther(amount);
        
        const txResult = await sendTransaction({
          to: recipient as `0x${string}`,
          value: valueInWei,
        });
        txHash = txResult.hash;
        
        console.log('Native U2U transfer transaction hash:', txHash);
      } else {
        // Send ERC20 token using writeContract
        console.log(`Sending ${amount} ${selectedToken} to ${recipient}`);
        
        const amountInWei = parseUnits(amount, selectedTokenInfo.decimals);
        
        txHash = await writeContract(config, {
          address: selectedTokenInfo.address as `0x${string}`,
          abi: [
            {
              "type": "function",
              "name": "transfer",
              "stateMutability": "nonpayable",
              "inputs": [
                {"type": "address", "name": "to"},
                {"type": "uint256", "name": "value"}
              ],
              "outputs": [{"type": "bool"}]
            }
          ],
          functionName: 'transfer',
          args: [recipient as `0x${string}`, amountInWei],
        });
        
        console.log('ERC20 transfer transaction hash:', txHash);
      }
      
      setNotificationType('success');
      setNotificationMessage(`${amount} ${selectedToken} sent successfully to ${recipient}. Transaction: ${txHash.substring(0, 10)}...`);
      setShowNotification(true);
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
        setShowNotification(false);
        // Reset form
        setAmount('');
        setRecipient('');
        setMessage('');
        setSelectedFile(null);
        setFileName('');
        setIsSending(false);
      }, 2000);
      
    } catch (error) {
      console.error('Transaction error:', error);
      setNotificationType('error');
      setNotificationMessage(error instanceof Error ? error.message : 'Transaction failed. Please try again.');
      setShowNotification(true);
      setIsSending(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
        <div className="bg-white rounded-lg max-w-xs w-full p-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-gray-900">Send Money</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Send Method Selection */}
          <div className="mb-2">
            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
              Choose Send Method
            </h3>
            <div className="space-y-1">
              {sendMethods.map((method) => {
                const MethodIcon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => {
                      if (method.comingSoon) {
                        setShowComingSoon(true);
                      } else {
                        setSendMethod(method.id as 'email' | 'address' | 'multiple');
                      }
                    }}
                    className={`w-full flex items-center space-x-1 p-1.5 rounded-lg border transition-colors text-left relative ${
                      sendMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : method.comingSoon
                        ? 'border-gray-200 opacity-60 cursor-not-allowed'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    disabled={method.comingSoon}
                  >
                    <div className={`w-4 h-4 rounded-lg flex items-center justify-center ${
                      sendMethod === method.id ? 'bg-blue-500' : 'bg-gray-100'
                    }`}>
                      <MethodIcon className={`w-2 h-2 ${
                        sendMethod === method.id ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium text-xs ${
                        sendMethod === method.id ? 'text-blue-600' : 'text-gray-900'
                      }`}>
                        {method.title}
                      </div>
                      <div className="text-xs text-gray-500">{method.description}</div>
                    </div>
                    {method.comingSoon && (
                      <div className="absolute top-1 right-1 bg-orange-500 text-white text-xs px-1 py-0.5 rounded-full flex items-center">
                        <Clock className="w-2 h-2 mr-0.5" />
                        Soon
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Send Form */}
          <div className="space-y-2">
            {/* Token Selection */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-0.5">
                Select Token
              </label>
              <div className="relative">
                <select
                  value={selectedToken}
                  onChange={(e) => setSelectedToken(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs appearance-none bg-white"
                >
                  {isLoadingTokens ? (
                    <option>Loading tokens...</option>
                  ) : (
                    availableTokens.map((token) => (
                      <option key={token.symbol} value={token.symbol}>
                        {token.symbol} - {parseFloat(token.balance).toFixed(4)} available
                      </option>
                    ))
                  )}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <Coins className="w-3 h-3 text-gray-400" />
                </div>
              </div>
              {selectedToken && (
                <div className="mt-0.5 text-xs text-gray-500">
                  Balance: {availableTokens.find(t => t.symbol === selectedToken)?.balance || '0'} {selectedToken}
                </div>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-0.5">
                Amount ({selectedToken})
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.0001"
                className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
              />
            </div>

            {/* Recipient */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-0.5">
                {sendMethod === 'email' ? 'Email Address' : 
                 sendMethod === 'address' ? 'Wallet Address' : 'CSV File'}
              </label>
              
              {sendMethod === 'multiple' ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".csv"
                    className="hidden"
                  />
                  {selectedFile ? (
                    <div className="space-y-1">
                      <div className="flex items-center justify-center space-x-1">
                        <Upload className="w-3 h-3 text-green-500" />
                        <span className="text-xs font-medium text-gray-900">{fileName}</span>
                      </div>
                      <p className="text-xs text-gray-500">File selected successfully</p>
                      <button 
                        onClick={handleChooseFile}
                        className="text-blue-500 text-xs hover:text-blue-600 transition-colors"
                      >
                        Choose different file
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-gray-400 mx-auto mb-0.5" />
                      <p className="text-xs text-gray-600 mb-0.5">Upload CSV file</p>
                      <p className="text-xs text-gray-500 mb-1">Format: email,amount,message</p>
                      <button 
                        onClick={handleChooseFile}
                        className="bg-blue-500 text-white px-2 py-1 rounded-lg text-xs hover:bg-blue-600 transition-colors"
                      >
                        Choose File
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <input
                  type={sendMethod === 'email' ? 'email' : 'text'}
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder={currentMethod?.placeholder}
                  className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                />
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-0.5">
                Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a message..."
                rows={2}
                className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-xs"
              />
            </div>

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={!amount || (sendMethod === 'multiple' ? !selectedFile : !recipient) || isSending}
              className="w-full bg-blue-600 text-white py-1.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center text-xs"
            >
              {isSending ? 'Sending...' : 'Send Money'}
              {!isSending && <ArrowRight className="w-3 h-3 ml-1" />}
            </button>
          </div>

          {/* Info */}
          <div className="mt-2 text-center">
            <p className="text-xs text-gray-500">
              Transaction will be processed on the selected network
            </p>
          </div>
        </div>
      </div>

      {/* Coming Soon Modal */}
      {showComingSoon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-lg max-w-xs w-full p-3 text-center">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Coming Soon!</h3>
            <p className="text-gray-600 mb-3 text-xs">
              This send method is currently under development. We're working hard to bring you the best experience.
            </p>
            <button
              onClick={() => setShowComingSoon(false)}
              className="w-full bg-blue-500 text-white py-1.5 rounded-lg font-semibold hover:bg-blue-600 transition-colors text-xs"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Notification */}
      {showNotification && (
        <Notification
          type={notificationType}
          title={notificationType === 'success' ? 'Transaction Successful!' : 'Transaction Failed'}
          message={notificationMessage}
          onClose={() => setShowNotification(false)}
          duration={3000}
        />
      )}
    </>
  );
};

export default SendModal; 