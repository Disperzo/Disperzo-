import React from 'react';
import { X, Building2 } from 'lucide-react';

interface WithdrawModalProps {
  onClose: () => void;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Withdraw to Bank</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Withdraw to Bank
              </h3>
              <p className="text-gray-600 mb-4">
                Withdraw using offramp or international transfer
              </p>
              <button className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors">
                Complete KYC
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal; 