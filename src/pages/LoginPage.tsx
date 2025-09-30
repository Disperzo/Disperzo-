import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight, Wallet, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const { login, authenticated, ready } = usePrivy();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (ready && authenticated) {
      navigate('/home');
    }
  }, [ready, authenticated, navigate]);

  const handleEmailLogin = () => {
    login();
  };

  const handleWalletLogin = () => {
    login();
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gray-50">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle, #9CA3AF 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />
      </div>

      {/* Header/Logo */}
      <div className="relative z-10 flex justify-center pt-8 pb-5">
        <div className="flex items-center space-x-1">
          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent transform rotate-45"></div>
          </div>
          <span className="text-lg font-bold text-gray-900">Disperzo</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-2">
        <div className="w-full max-w-sm">
          {/* Main Card */}
          <div className="bg-white rounded-lg shadow-lg p-5">
            <div className="text-center mb-5">
              <h1 className="text-lg font-bold text-gray-900 mb-1">
                Global payouts for web3 businesses
              </h1>
              <p className="text-gray-600 text-sm">
                Send funds to your vendors, contractors and employees in real time to 50+ countries
              </p>
            </div>

            {/* Email Login */}
              <button
              onClick={handleEmailLogin}
              className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center mb-3"
            >
              <Mail className="w-3 h-3 mr-1" />
              <span className="text-sm">Continue with Email</span>
              </button>

            {/* Separator */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-1 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* Wallet Login */}
            <button
              onClick={handleWalletLogin}
              className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center mb-3"
            >
              <Wallet className="w-3 h-3 mr-1" />
              <span className="text-sm">Connect Wallet</span>
            </button>

            {/* Security Note */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <Shield className="w-3 h-3 text-blue-600 mr-1 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-800">
                  <p className="font-medium mb-0.5">Secure & Private</p>
                  <p className="text-blue-600">
                    Your data is encrypted and never shared. We support all major wallets and social logins.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center pb-5">
        <p className="text-gray-500 text-xs">
          © Disperzo 2025 · Contact · Privacy Policy · Terms of Conditions
        </p>
      </div>
    </div>
  );
};

export default LoginPage; 