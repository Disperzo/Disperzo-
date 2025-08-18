import React, { useState } from 'react';
import { X, Mail, MapPin, Users, Upload, ArrowRight } from 'lucide-react';
import Notification from './Notification';

interface SendModalProps {
  onClose: () => void;
}

const SendModal: React.FC<SendModalProps> = ({ onClose }) => {
  const [sendMethod, setSendMethod] = useState<'email' | 'address' | 'multiple'>('email');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const sendMethods = [
    {
      id: 'email',
      title: 'Send to Email',
      description: 'Send money to someone using their email address',
      icon: Mail,
      placeholder: 'Enter email address'
    },
    {
      id: 'address',
      title: 'Send to Address',
      description: 'Send money to a specific wallet address',
      icon: MapPin,
      placeholder: 'Enter wallet address'
    },
    {
      id: 'multiple',
      title: 'Send to Multiple',
      description: 'Send money to multiple recipients via CSV',
      icon: Users,
      placeholder: 'Upload CSV file'
    }
  ];

  const currentMethod = sendMethods.find(method => method.id === sendMethod);

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
    
    setIsSending(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success notification
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
      }, 1500);
      
    } catch {
      // Handle error if needed
      setIsSending(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-sm w-full p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Send Money</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Send Method Selection */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
              Choose Send Method
            </h3>
            <div className="space-y-1.5">
              {sendMethods.map((method) => {
                const MethodIcon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSendMethod(method.id as 'email' | 'address' | 'multiple')}
                    className={`w-full flex items-center space-x-2 p-2.5 rounded-lg border transition-colors text-left ${
                      sendMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                      sendMethod === method.id ? 'bg-blue-500' : 'bg-gray-100'
                    }`}>
                      <MethodIcon className={`w-3 h-3 ${
                        sendMethod === method.id ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium text-sm ${
                        sendMethod === method.id ? 'text-blue-600' : 'text-gray-900'
                      }`}>
                        {method.title}
                      </div>
                      <div className="text-xs text-gray-500">{method.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Send Form */}
          <div className="space-y-3">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (USDC)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Recipient */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {sendMethod === 'email' ? 'Email Address' : 
                 sendMethod === 'address' ? 'Wallet Address' : 'CSV File'}
              </label>
              
              {sendMethod === 'multiple' ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".csv"
                    className="hidden"
                  />
                  {selectedFile ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center space-x-2">
                        <Upload className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium text-gray-900">{fileName}</span>
                      </div>
                      <p className="text-xs text-gray-500">File selected successfully</p>
                      <button 
                        onClick={handleChooseFile}
                        className="text-blue-500 text-sm hover:text-blue-600 transition-colors"
                      >
                        Choose different file
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                      <p className="text-sm text-gray-600 mb-1">Upload CSV file</p>
                      <p className="text-xs text-gray-500 mb-2">Format: email,amount,message</p>
                      <button 
                        onClick={handleChooseFile}
                        className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-600 transition-colors"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a message..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
              />
            </div>

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={!amount || (sendMethod === 'multiple' ? !selectedFile : !recipient) || isSending}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center text-sm"
            >
              {isSending ? 'Sending...' : 'Send Money'}
              {!isSending && <ArrowRight className="w-4 h-4 ml-2" />}
            </button>
          </div>

          {/* Info */}
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500">
              Transaction will be processed on the selected network
            </p>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {showNotification && (
        <Notification
          type="success"
          title="Money Sent Successfully!"
          message={sendMethod === 'multiple' 
            ? `${amount} USDC has been sent to multiple recipients via CSV`
            : `${amount} USDC has been sent to ${recipient}`
          }
          onClose={() => setShowNotification(false)}
          duration={3000}
        />
      )}
    </>
  );
};

export default SendModal; 