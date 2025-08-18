import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import DepositModal from './DepositModal';

const TransactionSection = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showDepositModal, setShowDepositModal] = useState(false);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'deposits', label: 'Deposits' },
    { id: 'offramps', label: 'Offramps' },
    { id: 'send', label: 'Send' }
  ];

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Your transactions</h3>
          <div className="flex items-center space-x-4">
            {/* Filters */}
            <div className="flex space-x-1">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeFilter === filter.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            
            {/* Settings */}
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Empty State */}
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No transactions yet!</h4>
          <p className="text-gray-500 mb-6">
            Your transaction history will appear here once you start using Disperzo.
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => setShowDepositModal(true)}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Make your first deposit
            </button>
            <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Learn more
            </button>
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <DepositModal onClose={() => setShowDepositModal(false)} />
      )}
    </>
  );
};

export default TransactionSection; 