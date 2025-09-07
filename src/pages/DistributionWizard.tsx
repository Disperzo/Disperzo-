import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Upload, CheckCircle, ExternalLink, Copy } from 'lucide-react';
import WizardStep from '../components/WizardStep';

const DistributionWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [recipientsCount, setRecipientsCount] = useState(0);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const deploymentData = {
    transactionHash: '0x1234567890abcdef1234567890abcdef12345678',
    contractAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    gasUsed: '245,678',
    totalAmount: '$50,000',
    recipients: 2500
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      // Simulate parsing CSV to get recipient count
      setRecipientsCount(Math.floor(Math.random() * 1000) + 100);
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    // Simulate deployment process
    setTimeout(() => {
      setIsDeploying(false);
      setShowSuccessDialog(true);
    }, 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const steps = [
    {
      number: 1,
      title: 'Setup',
      description: 'Basic configuration'
    },
    {
      number: 2,
      title: 'Recipients',
      description: 'Add recipients'
    },
    {
      number: 3,
      title: 'Review',
      description: 'Final review'
    },
    {
      number: 4,
      title: 'Deploy',
      description: 'Launch distribution'
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Distribution Setup</h3>
              <p className="text-gray-600">Configure your distribution campaign</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Name
                </label>
                <input
                  type="text"
                  placeholder="Enter campaign name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Token
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>USDC</option>
                  <option>USDT</option>
                  <option>ETH</option>
                  <option>MATIC</option>
                  <option>BNB</option>
                  <option>DAI</option>
                  <option>WETH</option>
                  <option>WBTC</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Network
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Ethereum</option>
                  <option>Polygon</option>
                  <option>Arbitrum</option>
                  <option>Base</option>
                  <option>Optimism</option>
                  <option>BSC</option>
                  <option>Somnia</option>
                  <option>U2U Solar</option>
                  <option>U2U Nebulas</option>
                </select>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Recipients</h3>
              <p className="text-gray-600">Upload your recipient list or add manually</p>
            </div>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".csv"
                  className="hidden"
                />
                {selectedFile ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-2">
                      <Upload className="w-8 h-8 text-green-500" />
                      <span className="text-lg font-medium text-gray-900">{fileName}</span>
                    </div>
                    <p className="text-sm text-gray-600">File selected successfully</p>
                    <p className="text-sm text-blue-600 font-medium">{recipientsCount} recipients found</p>
                    <button 
                      onClick={handleChooseFile}
                      className="text-blue-500 text-sm hover:text-blue-600 transition-colors"
                    >
                      Choose different file
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="text-gray-400 mb-4">
                      <Upload className="w-12 h-12 mx-auto" />
                    </div>
                    <p className="text-gray-600 mb-2">Upload CSV file or drag and drop</p>
                    <p className="text-sm text-gray-500">Supports .csv files with address and amount columns</p>
                  </>
                )}
              </div>
              
              <div className="flex justify-center">
                <button 
                  onClick={handleChooseFile}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {selectedFile ? 'Upload Another File' : 'Upload File'}
                </button>
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Review Distribution</h3>
              <p className="text-gray-600">Review your distribution details before launching</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Campaign Name:</span>
                <span className="font-medium text-gray-900">Q4 Airdrop Campaign</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Token:</span>
                <span className="font-medium text-gray-900">USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Network:</span>
                <span className="font-medium text-gray-900">Ethereum</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Recipients:</span>
                <span className="font-medium text-gray-900">{recipientsCount > 0 ? recipientsCount.toLocaleString() : '2,500'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-medium text-gray-900">$50,000</span>
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Launch Distribution</h3>
              <p className="text-gray-600">Deploy your distribution to the blockchain</p>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="font-medium text-gray-900">Ready to Deploy</span>
              </div>
              <p className="text-sm text-gray-600">
                Your distribution is ready to be deployed. This action will create a smart contract and begin processing transactions.
              </p>
            </div>
            
            <div className="flex justify-center">
              <button 
                onClick={handleDeploy}
                disabled={isDeploying}
                className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                {isDeploying ? 'Deploying...' : 'Deploy Distribution'}
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Create New Distribution</h1>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
                <WizardStep
                key={step.number}
                  step={step}
                  isActive={currentStep === step.number}
                  isCompleted={currentStep > step.number}
                isLast={index === steps.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </button>

            <button
              onClick={nextStep}
            disabled={currentStep === steps.length}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              currentStep === steps.length
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {currentStep === steps.length ? 'Complete' : 'Next'}
            {currentStep !== steps.length && <ArrowRight className="w-4 h-4 ml-2" />}
            </button>
        </div>
      </div>

      {/* Success Dialog */}
      {showSuccessDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Deployment Successful!</h3>
              <p className="text-gray-600 mb-6">Your distribution has been deployed to the blockchain</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Transaction Hash</span>
                  <button 
                    onClick={() => copyToClipboard(deploymentData.transactionHash)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <code className="text-xs text-gray-600 font-mono truncate flex-1">
                    {deploymentData.transactionHash}
                  </code>
                  <a 
                    href={`https://etherscan.io/tx/${deploymentData.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-500 hover:text-blue-600"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Contract Address</span>
                  <button 
                    onClick={() => copyToClipboard(deploymentData.contractAddress)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <code className="text-xs text-gray-600 font-mono truncate flex-1">
                    {deploymentData.contractAddress}
                  </code>
                  <a 
                    href={`https://etherscan.io/address/${deploymentData.contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-500 hover:text-blue-600"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Gas Used</div>
                  <div className="text-lg font-semibold text-gray-900">{deploymentData.gasUsed}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Total Amount</div>
                  <div className="text-lg font-semibold text-gray-900">{deploymentData.totalAmount}</div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowSuccessDialog(false)}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowSuccessDialog(false);
                  // Navigate to dashboard or distributions list
                }}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                View Distributions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistributionWizard;