import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyableAddressProps {
  address: string;
  showFull?: boolean;
  className?: string;
}

const CopyableAddress: React.FC<CopyableAddressProps> = ({ 
  address, 
  showFull = false, 
  className = '' 
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = address;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (addr: string): string => {
    if (!addr) return '';
    if (showFull) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!address) return null;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="font-mono text-sm">
        {formatAddress(address)}
      </span>
      <button
        onClick={handleCopy}
        className="p-1 hover:bg-gray-100 rounded transition-colors group"
        title={copied ? 'Copied!' : 'Copy address'}
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : (
          <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
        )}
      </button>
    </div>
  );
};

export default CopyableAddress;
