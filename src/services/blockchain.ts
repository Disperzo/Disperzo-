import { networks, Network, getNetworkById } from '../config/networks';

export interface BlockchainConfig {
  defaultNetwork: string;
  supportedNetworks: string[];
  rpcUrls: Record<string, string>;
  explorerUrls: Record<string, string>;
  chainIds: Record<string, number>;
}

export const blockchainConfig: BlockchainConfig = {
  defaultNetwork: 'ethereum',
  supportedNetworks: networks.map(network => network.id),
  rpcUrls: networks.reduce((acc, network) => {
    acc[network.id] = network.rpcUrl;
    return acc;
  }, {} as Record<string, string>),
  explorerUrls: networks.reduce((acc, network) => {
    acc[network.id] = network.explorerUrl;
    return acc;
  }, {} as Record<string, string>),
  chainIds: networks.reduce((acc, network) => {
    acc[network.id] = network.chainId;
    return acc;
  }, {} as Record<string, number>),
};

export class BlockchainService {
  private static instance: BlockchainService;
  private currentNetwork: string = blockchainConfig.defaultNetwork;

  private constructor() {}

  public static getInstance(): BlockchainService {
    if (!BlockchainService.instance) {
      BlockchainService.instance = new BlockchainService();
    }
    return BlockchainService.instance;
  }

  public getCurrentNetwork(): string {
    return this.currentNetwork;
  }

  public setCurrentNetwork(networkId: string): void {
    if (this.isNetworkSupported(networkId)) {
      this.currentNetwork = networkId;
    } else {
      throw new Error(`Network ${networkId} is not supported`);
    }
  }

  public isNetworkSupported(networkId: string): boolean {
    return blockchainConfig.supportedNetworks.includes(networkId);
  }

  public getNetworkInfo(networkId: string): Network | undefined {
    return getNetworkById(networkId);
  }

  public getRpcUrl(networkId: string): string {
    const network = this.getNetworkInfo(networkId);
    if (!network) {
      throw new Error(`Network ${networkId} not found`);
    }
    return network.rpcUrl;
  }

  public getExplorerUrl(networkId: string): string {
    const network = this.getNetworkInfo(networkId);
    if (!network) {
      throw new Error(`Network ${networkId} not found`);
    }
    return network.explorerUrl;
  }

  public getChainId(networkId: string): number {
    const network = this.getNetworkInfo(networkId);
    if (!network) {
      throw new Error(`Network ${networkId} not found`);
    }
    return network.chainId;
  }

  public getSupportedNetworks(): Network[] {
    return networks;
  }

  public getMainnetNetworks(): Network[] {
    return networks.filter(network => !network.isTestnet);
  }

  public getTestnetNetworks(): Network[] {
    return networks.filter(network => network.isTestnet);
  }

  public isTestnet(networkId: string): boolean {
    const network = this.getNetworkInfo(networkId);
    return network ? network.isTestnet : false;
  }

  // Somnia-specific methods
  public isSomniaNetwork(networkId: string): boolean {
    return networkId === 'somnia' || networkId === 'somnia-testnet';
  }

  public getSomniaNetworks(): Network[] {
    return networks.filter(network => 
      network.id === 'somnia' || network.id === 'somnia-testnet'
    );
  }

  public getSomniaMainnet(): Network | undefined {
    return networks.find(network => network.id === 'somnia');
  }

  public getSomniaTestnet(): Network | undefined {
    return networks.find(network => network.id === 'somnia-testnet');
  }

  // U2U-specific methods
  public isU2UNetwork(networkId: string): boolean {
    return networkId === 'u2u-solar' || networkId === 'u2u-nebulas';
  }

  public getU2UNetworks(): Network[] {
    return networks.filter(network => 
      network.id === 'u2u-solar' || network.id === 'u2u-nebulas'
    );
  }

  public getU2USolar(): Network | undefined {
    return networks.find(network => network.id === 'u2u-solar');
  }

  public getU2UNebulas(): Network | undefined {
    return networks.find(network => network.id === 'u2u-nebulas');
  }
}

export const blockchainService = BlockchainService.getInstance();
