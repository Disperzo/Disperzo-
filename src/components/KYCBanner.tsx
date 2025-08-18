import React from 'react';
import { Shield, ArrowRight } from 'lucide-react';

const KYCBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 mb-12 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">
              Complete your KYC to start using Disperzo
            </h3>
            <p className="text-blue-100 text-sm">
              Verify your identity to unlock advanced features and higher limits
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-blue-100 text-sm font-medium">Coming Soon</span>
          <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
            Complete KYC
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default KYCBanner; 