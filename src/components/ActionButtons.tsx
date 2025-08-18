import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Send, QrCode } from 'lucide-react';
import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';
import SendModal from './SendModal';
import GetPaidModal from './GetPaidModal';

const ActionButtons = () => {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showGetPaidModal, setShowGetPaidModal] = useState(false);

  const actions = [
    {
      title: 'Deposit',
      icon: ArrowDown,
      color: 'bg-green-500',
      onClick: () => setShowDepositModal(true)
    },
    {
      title: 'To Bank',
      icon: ArrowUp,
      color: 'bg-blue-500',
      onClick: () => setShowWithdrawModal(true)
    },
    {
      title: 'Send',
      icon: Send,
      color: 'bg-purple-500',
      onClick: () => setShowSendModal(true)
    },
    {
      title: 'Get Paid',
      icon: QrCode,
      color: 'bg-orange-500',
      onClick: () => setShowGetPaidModal(true)
    }
  ];

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.onClick}
                className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900">{action.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      {showDepositModal && (
        <DepositModal onClose={() => setShowDepositModal(false)} />
      )}
      {showWithdrawModal && (
        <WithdrawModal onClose={() => setShowWithdrawModal(false)} />
      )}
      {showSendModal && (
        <SendModal onClose={() => setShowSendModal(false)} />
      )}
      {showGetPaidModal && (
        <GetPaidModal onClose={() => setShowGetPaidModal(false)} />
      )}
    </>
  );
};

export default ActionButtons; 