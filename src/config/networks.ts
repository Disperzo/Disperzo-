export interface Network {
  id: string;
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  icon: string;
  color: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  isTestnet: boolean;
}

export const networks: Network[] = [
  // Mainnet Networks
  {
    id: 'ethereum',
    name: 'Ethereum',
    chainId: 1,
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
    explorerUrl: 'https://etherscan.io',
    icon: '🔵',
    color: 'blue',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    isTestnet: false,
  },
  {
    id: 'polygon',
    name: 'Polygon',
    chainId: 137,
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    icon: '🟣',
    color: 'purple',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    isTestnet: false,
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    chainId: 42161,
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorerUrl: 'https://arbiscan.io',
    icon: '🔵',
    color: 'blue',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    isTestnet: false,
  },
  {
    id: 'base',
    name: 'Base',
    chainId: 8453,
    rpcUrl: 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org',
    icon: '🔷',
    color: 'blue',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    isTestnet: false,
  },
  {
    id: 'optimism',
    name: 'Optimism',
    chainId: 10,
    rpcUrl: 'https://mainnet.optimism.io',
    explorerUrl: 'https://optimistic.etherscan.io',
    icon: '🔴',
    color: 'red',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    isTestnet: false,
  },
  {
    id: 'bsc',
    name: 'BNB Smart Chain',
    chainId: 56,
    rpcUrl: 'https://bsc-dataseed.binance.org',
    explorerUrl: 'https://bscscan.com',
    icon: '🟡',
    color: 'yellow',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    isTestnet: false,
  },
  // Somnia Networks
  {
    id: 'somnia',
    name: 'Somnia',
    chainId: 5031,
    rpcUrl: 'https://api.infra.mainnet.somnia.network',
    explorerUrl: 'https://mainnet.somnia.w3us.site',
    icon: '🌙',
    color: 'indigo',
    nativeCurrency: {
      name: 'Somnia',
      symbol: 'SOMI',
      decimals: 18,
    },
    isTestnet: false,
  },
  {
    id: 'somnia-testnet',
    name: 'Somnia Testnet',
    chainId: 50312,
    rpcUrl: 'https://api.infra.testnet.somnia.network',
    explorerUrl: 'https://testnet.somnia.w3us.site',
    icon: '🌙',
    color: 'indigo',
    nativeCurrency: {
      name: 'Somnia',
      symbol: 'SOMI',
      decimals: 18,
    },
    isTestnet: true,
  },
  // Testnet Networks
  {
    id: 'sepolia',
    name: 'Sepolia',
    chainId: 11155111,
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_PROJECT_ID',
    explorerUrl: 'https://sepolia.etherscan.io',
    icon: '🔵',
    color: 'blue',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'SEP',
      decimals: 18,
    },
    isTestnet: true,
  },
  {
    id: 'mantle-sepolia',
    name: 'Mantle Sepolia',
    chainId: 5003,
    rpcUrl: 'https://rpc.sepolia.mantle.xyz',
    explorerUrl: 'https://explorer.sepolia.mantle.xyz',
    icon: '🔵',
    color: 'blue',
    nativeCurrency: {
      name: 'Mantle',
      symbol: 'MNT',
      decimals: 18,
    },
    isTestnet: true,
  },
  {
    id: 'electroneum-testnet',
    name: 'Electroneum Testnet',
    chainId: 5201420,
    rpcUrl: 'https://rpc.ankr.com/electroneum_testnet',
    explorerUrl: 'https://testnet-blockexplorer.electroneum.com',
    icon: '⚡',
    color: 'green',
    nativeCurrency: {
      name: 'Electroneum',
      symbol: 'ETN',
      decimals: 8,
    },
    isTestnet: true,
  },
];

export const getNetworkByChainId = (chainId: number): Network | undefined => {
  return networks.find(network => network.chainId === chainId);
};

export const getNetworkById = (id: string): Network | undefined => {
  return networks.find(network => network.id === id);
};

export const getMainnetNetworks = (): Network[] => {
  return networks.filter(network => !network.isTestnet);
};

export const getTestnetNetworks = (): Network[] => {
  return networks.filter(network => network.isTestnet);
};

export const getEVMNetworks = (): Network[] => {
  // All networks in this config are EVM compatible
  return networks;
};

export const getNonEVMNetworks = (): Network[] => {
  // Placeholder for future non-EVM networks
  return [];
};
