import React from 'react';
import { useContract } from '../contexts/ContractContext';
import { useAuth } from '../contexts/AuthContext';
import { usePrivy } from '@privy-io/react-auth';
import CopyableAddress from './CopyableAddress';

const ConnectionDebug = () => {
  const { isConnected, isInitialized, currentNetwork, address, balance, error } = useContract();
  const { user, authenticated, ready } = usePrivy();
  const { user: authUser } = useAuth();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg text-xs font-mono max-w-md z-50">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <div className="space-y-1">
        <div>Privy Ready: {ready ? '✅' : '❌'}</div>
        <div>Privy Auth: {authenticated ? '✅' : '❌'}</div>
        <div>User: {user ? '✅' : '❌'}</div>
        <div>Wallet: {user?.wallet ? '✅' : '❌'}</div>
        <div>Wallet Address: {user?.wallet?.address ? <CopyableAddress address={user.wallet.address} showFull={true} className="text-white" /> : 'None'}</div>
        <div>Contract Connected: {isConnected ? '✅' : '❌'}</div>
        <div>Contract Initialized: {isInitialized ? '✅' : '❌'}</div>
        <div>Network: {currentNetwork}</div>
        <div>Address: {address ? <CopyableAddress address={address} showFull={true} className="text-white" /> : 'None'}</div>
        <div>Balance: {balance || 'None'}</div>
        {error && <div className="text-red-400">Error: {error}</div>}
      </div>
    </div>
  );
};

export default ConnectionDebug;
