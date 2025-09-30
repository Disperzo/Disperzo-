import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Send, QrCode, Clock } from 'lucide-react';
import SendModal from './SendModal';

const ActionButtons = () => {
  const [showSendModal, setShowSendModal] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

  const actions = [
    {
      title: 'Deposit',
      icon: ArrowDown,
      color: 'bg-green-500',
      comingSoon: true,
      onClick: () => setShowComingSoon(true)
    },
    {
      title: 'To Bank',
      icon: ArrowUp,
      color: 'bg-blue-500',
      comingSoon: true,
      onClick: () => setShowComingSoon(true)
    },
    {
      title: 'Send',
      icon: Send,
      color: 'bg-purple-500',
      comingSoon: false,
      onClick: () => setShowSendModal(true)
    },
    {
      title: 'Get Paid',
      icon: QrCode,
      color: 'bg-orange-500',
      comingSoon: true,
      onClick: () => setShowComingSoon(true)
    }
  ];

  return (
    <>
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.onClick}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors relative ${
                  action.comingSoon 
                    ? 'opacity-60 cursor-not-allowed' 
                    : 'hover:bg-gray-50'
                }`}
                disabled={action.comingSoon}
              >
                <div className={`w-7 h-7 ${action.color} rounded-lg flex items-center justify-center mb-2`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-900">{action.title}</span>
                {action.comingSoon && (
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

      {/* Modals */}
      {showSendModal && (
        <SendModal onClose={() => setShowSendModal(false)} />
      )}
      {showComingSoon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-lg max-w-xs w-full p-3 text-center">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Coming Soon!</h3>
            <p className="text-gray-600 mb-3 text-xs">
              This feature is currently under development. We're working hard to bring you the best experience.
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
    </>
  );
};

export default ActionButtons; 