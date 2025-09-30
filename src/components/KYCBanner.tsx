import React from 'react';
import { Shield, ArrowRight } from 'lucide-react';

const KYCBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-7 mb-8 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-0.5">
              Complete your KYC to start using Disperzo
            </h3>
            <p className="text-blue-100 text-xs">
              Verify your identity to unlock advanced features and higher limits
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-blue-100 text-xs font-medium">Coming Soon</span>
          <button className="bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-lg font-medium transition-colors flex items-center text-xs">
            Complete KYC
            <ArrowRight className="w-3 h-3 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default KYCBanner; 