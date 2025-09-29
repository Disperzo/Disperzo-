import { ethers } from 'ethers';
import { 
  DISPERZO_CORE_ABI, 
  CONTRACT_ADDRESSES, 
  TEST_TOKEN_ADDRESSES,
  type ERC20Transfer,
  type ERC721Transfer,
  type ERC1155Transfer,
  type Distribution,
  type DistributionParams
} from '../contracts/DisperzoCore';
import { blockchainService } from './blockchain';

export class DistributionService {
  private static instance: DistributionService;
  private provider: ethers.Provider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;

  private constructor() {}

  public static getInstance(): DistributionService {
    if (!DistributionService.instance) {
      DistributionService.instance = new DistributionService();
    }
    return DistributionService.instance;
  }

  // Initialize with provider and signer
  public async initialize(provider: ethers.Provider, signer: ethers.Signer, networkId: string) {
    this.provider = provider;
    this.signer = signer;
    
    const contractAddress = CONTRACT_ADDRESSES[networkId as keyof typeof CONTRACT_ADDRESSES];
    if (!contractAddress) {
      throw new Error(`Contract not deployed on network: ${networkId}`);
    }

    this.contract = new ethers.Contract(contractAddress, DISPERZO_CORE_ABI, signer);
  }

  // Check if service is initialized
  public isInitialized(): boolean {
    return !!(this.provider && this.signer && this.contract);
  }

  // Get contract instance
  public getContract(): ethers.Contract {
    if (!this.contract) {
      throw new Error('DistributionService not initialized');
    }
    return this.contract;
  }

  // Create ERC20 distribution
  public async createERC20Distribution(
    transfers: ERC20Transfer[],
    name: string,
    description: string,
    value?: string
  ): Promise<string> {
    if (!this.contract) {
      throw new Error('DistributionService not initialized');
    }

    try {
      const tx = await this.contract.bulkTransferERC20(
        transfers,
        name,
        description,
        value ? { value: ethers.parseEther(value) } : {}
      );
      
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error('Error creating ERC20 distribution:', error);
      throw error;
    }
  }

  // Create ERC721 distribution
  public async createERC721Distribution(
    transfers: ERC721Transfer[],
    name: string,
    description: string
  ): Promise<string> {
    if (!this.contract) {
      throw new Error('DistributionService not initialized');
    }

    try {
      const tx = await this.contract.bulkTransferERC721(
        transfers,
        name,
        description
      );
      
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error('Error creating ERC721 distribution:', error);
      throw error;
    }
  }

  // Create ERC1155 distribution
  public async createERC1155Distribution(
    transfers: ERC1155Transfer[],
    name: string,
    description: string
  ): Promise<string> {
    if (!this.contract) {
      throw new Error('DistributionService not initialized');
    }

    try {
      const tx = await this.contract.bulkTransferERC1155(
        transfers,
        name,
        description
      );
      
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error('Error creating ERC1155 distribution:', error);
      throw error;
    }
  }

  // Create mixed distribution (ERC20 + ERC721 + ERC1155)
  public async createMixedDistribution(
    erc20Transfers: ERC20Transfer[],
    erc721Transfers: ERC721Transfer[],
    erc1155Transfers: ERC1155Transfer[],
    name: string,
    description: string,
    value?: string
  ): Promise<string> {
    if (!this.contract) {
      throw new Error('DistributionService not initialized');
    }

    try {
      const tx = await this.contract.mixedBulkTransfer(
        erc20Transfers,
        erc721Transfers,
        erc1155Transfers,
        name,
        description,
        value ? { value: ethers.parseEther(value) } : {}
      );
      
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error('Error creating mixed distribution:', error);
      throw error;
    }
  }

  // Get distribution details
  public async getDistribution(distributionId: string): Promise<Distribution> {
    if (!this.contract) {
      throw new Error('DistributionService not initialized');
    }

    try {
      const distribution = await this.contract.getDistribution(distributionId);
      return {
        id: distribution.id.toString(),
        creator: distribution.creator,
        name: distribution.name,
        description: distribution.description,
        createdAt: distribution.createdAt.toString(),
        totalRecipients: distribution.totalRecipients.toString(),
        totalValue: distribution.totalValue.toString(),
        isActive: distribution.isActive,
        isCompleted: distribution.isCompleted,
        completedAt: distribution.completedAt.toString()
      };
    } catch (error) {
      console.error('Error getting distribution:', error);
      throw error;
    }
  }

  // Get distributions by creator
  public async getDistributionsByCreator(creator: string): Promise<string[]> {
    if (!this.contract) {
      throw new Error('DistributionService not initialized');
    }

    try {
      const distributionIds = await this.contract.getDistributionsByCreator(creator);
      return distributionIds.map((id: any) => id.toString());
    } catch (error) {
      console.error('Error getting distributions by creator:', error);
      throw error;
    }
  }

  // Get total distributions count
  public async getTotalDistributions(): Promise<number> {
    if (!this.contract) {
      throw new Error('DistributionService not initialized');
    }

    try {
      const total = await this.contract.getTotalDistributions();
      return parseInt(total.toString());
    } catch (error) {
      console.error('Error getting total distributions:', error);
      throw error;
    }
  }

  // Get platform fee
  public async getPlatformFee(): Promise<number> {
    if (!this.contract) {
      throw new Error('DistributionService not initialized');
    }

    try {
      const fee = await this.contract.getPlatformFee();
      return parseInt(fee.toString());
    } catch (error) {
      console.error('Error getting platform fee:', error);
      throw error;
    }
  }

  // Get fee recipient
  public async getFeeRecipient(): Promise<string> {
    if (!this.contract) {
      throw new Error('DistributionService not initialized');
    }

    try {
      return await this.contract.getFeeRecipient();
    } catch (error) {
      console.error('Error getting fee recipient:', error);
      throw error;
    }
  }

  // Get collected fees
  public async getCollectedFees(token: string, recipient: string): Promise<string> {
    if (!this.contract) {
      throw new Error('DistributionService not initialized');
    }

    try {
      const fees = await this.contract.getCollectedFees(token, recipient);
      return ethers.formatEther(fees);
    } catch (error) {
      console.error('Error getting collected fees:', error);
      throw error;
    }
  }

  // Check if contract is paused
  public async isPaused(): Promise<boolean> {
    if (!this.contract) {
      throw new Error('DistributionService not initialized');
    }

    try {
      return await this.contract.paused();
    } catch (error) {
      console.error('Error checking pause status:', error);
      throw error;
    }
  }

  // Estimate gas for distribution
  public async estimateGas(
    method: 'bulkTransferERC20' | 'bulkTransferERC721' | 'bulkTransferERC1155' | 'mixedBulkTransfer',
    ...args: any[]
  ): Promise<bigint> {
    if (!this.contract) {
      throw new Error('DistributionService not initialized');
    }

    try {
      const gasEstimate = await this.contract[method].estimateGas(...args);
      return gasEstimate;
    } catch (error) {
      console.error('Error estimating gas:', error);
      throw error;
    }
  }

  // Get test token addresses for current network
  public getTestTokenAddresses(networkId: string) {
    return TEST_TOKEN_ADDRESSES[networkId as keyof typeof TEST_TOKEN_ADDRESSES];
  }

  // Validate distribution parameters
  public validateDistributionParams(params: DistributionParams): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!params.name || params.name.trim().length === 0) {
      errors.push('Distribution name is required');
    }

    if (!params.description || params.description.trim().length === 0) {
      errors.push('Distribution description is required');
    }

    const hasTransfers = 
      (params.erc20Transfers && params.erc20Transfers.length > 0) ||
      (params.erc721Transfers && params.erc721Transfers.length > 0) ||
      (params.erc1155Transfers && params.erc1155Transfers.length > 0);

    if (!hasTransfers) {
      errors.push('At least one transfer type is required');
    }

    // Validate ERC20 transfers
    if (params.erc20Transfers) {
      params.erc20Transfers.forEach((transfer, index) => {
        if (!transfer.token || !ethers.isAddress(transfer.token)) {
          errors.push(`ERC20 transfer ${index + 1}: Invalid token address`);
        }
        if (!transfer.recipients || transfer.recipients.length === 0) {
          errors.push(`ERC20 transfer ${index + 1}: No recipients specified`);
        }
        if (!transfer.amounts || transfer.amounts.length !== transfer.recipients.length) {
          errors.push(`ERC20 transfer ${index + 1}: Recipients and amounts count mismatch`);
        }
        transfer.recipients.forEach((recipient, recipientIndex) => {
          if (!ethers.isAddress(recipient)) {
            errors.push(`ERC20 transfer ${index + 1}, recipient ${recipientIndex + 1}: Invalid address`);
          }
        });
      });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

export const distributionService = DistributionService.getInstance();
