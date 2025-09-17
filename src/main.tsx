import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PrivyProvider } from '@privy-io/react-auth';
import App from './App.tsx';
import './index.css';
import { Buffer } from 'buffer';

// Make Buffer available globally
(window as any).Buffer = Buffer;

// Handle browser extension conflicts
if (typeof window !== 'undefined') {
  // Prevent multiple wallet extensions from conflicting
  const originalEthereum = (window as any).ethereum;
  if (originalEthereum) {
    try {
      Object.defineProperty(window, 'ethereum', {
        get: () => originalEthereum,
        configurable: true,
      });
    } catch (error) {
      // Ignore if already set
    }
  }
}

// Handle browser extension errors
window.addEventListener('error', (event) => {
  if (event.message?.includes('Could not establish connection') || 
      event.message?.includes('Receiving end does not exist') ||
      event.message?.includes('Cannot set property ethereum')) {
    // Suppress browser extension connection errors
    event.preventDefault();
    return false;
  }
});

// Handle unhandled promise rejections from extensions
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.message?.includes('Could not establish connection') ||
      event.reason?.message?.includes('Receiving end does not exist') ||
      event.reason?.message?.includes('Cannot set property ethereum')) {
    // Suppress browser extension connection errors
    event.preventDefault();
    return false;
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrivyProvider
      appId="cmdoi71us00vllb0k0ngynxfb"
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#2563eb',
          logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTAwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8dGV4dCB4PSI1MCIgeT0iMjYiIGZvbnQtZmFtaWx5PSJzeXN0ZW0tdWksIC1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgJ1NlZ29lIFVJJywgUm9ib3RvLCBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmLCAnQXBwbGUgQ29sb3IgRW1vamknLCAnU2Vnb2UgVUkgRW1vamknLCAnU2Vnb2UgVUkgU3ltYm9scyciIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiMyNTYzZWIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkRpc3BlcnpvPC90ZXh0Pgo8L3N2Zz4K',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        loginMethods: ['email', 'google', 'wallet'],
        supportedChains: [
          {
            id: 1,
            name: 'Ethereum',
            network: 'homestead',
            nativeCurrency: {
              name: 'Ether',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: {
              default: {
                http: ['https://mainnet.infura.io/v3/YOUR_PROJECT_ID'],
              },
              public: {
                http: ['https://mainnet.infura.io/v3/YOUR_PROJECT_ID'],
              },
            },
            blockExplorers: {
              default: {
                name: 'Etherscan',
                url: 'https://etherscan.io',
              },
            },
          },
          {
            id: 2484,
            name: 'U2U Nebulas',
            network: 'u2u-nebulas',
            nativeCurrency: {
              name: 'U2U',
              symbol: 'U2U',
              decimals: 18,
            },
            rpcUrls: {
              default: {
                http: ['https://rpc-nebulas-testnet.uniultra.xyz'],
              },
              public: {
                http: ['https://rpc-nebulas-testnet.uniultra.xyz'],
              },
            },
            blockExplorers: {
              default: {
                name: 'U2U Scan',
                url: 'https://testnet.u2uscan.xyz',
              },
            },
            testnet: true,
          },
        ],
      }}
    >
      <App />
    </PrivyProvider>
  </StrictMode>
);
