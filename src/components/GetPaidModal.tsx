import React from 'react';
import { X, DollarSign, QrCode, Link, FileText, Building2 } from 'lucide-react';

interface GetPaidModalProps {
  onClose: () => void;
}

const GetPaidModal: React.FC<GetPaidModalProps> = ({ onClose }) => {
  const getPaidOptions = [
    {
      id: 'qr',
      title: 'Show QR or Wallet Address',
      description: 'Share your address or QR code to receive USDC.',
      icon: QrCode,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      recommended: true
    },
    {
      id: 'link',
      title: 'Create an Payment link',
      description: 'Generate and send a link for quick payments.',
      icon: Link,
      bgColor: 'bg-gray-100',
      iconColor: 'text-gray-600',
      comingSoon: true
    },
    {
      id: 'invoice',
      title: 'Create an Invoice',
      description: 'Send an invoice to your customer.',
      icon: FileText,
      bgColor: 'bg-gray-100',
      iconColor: 'text-gray-600',
      comingSoon: true
    },
    {
      id: 'bank',
      title: 'Bank ACH or Wire',
      description: 'Accept USD, get paid in USDC.',
      icon: Building2,
      bgColor: 'bg-gray-100',
      iconColor: 'text-gray-600'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Get Paid</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-center space-x-3 mb-6">
            <span className="text-lg italic text-gray-700">
              Receive payment in digital dollar
            </span>
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Recommended Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
              Recommended
            </h3>
            {getPaidOptions.filter(option => option.recommended).map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  className="w-full p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all text-left"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 ${option.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${option.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {option.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Others Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
              Others
            </h3>
            <div className="space-y-3">
              {getPaidOptions.filter(option => !option.recommended).map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    className="w-full p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all text-left"
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 ${option.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-6 h-6 ${option.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {option.title}
                          </h3>
                          {option.comingSoon && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              Coming soon
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetPaidModal; 