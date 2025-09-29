// DisperzoCore Contract ABI and Configuration
export const DISPERZO_CORE_ABI = [
  {
    "type": "constructor",
    "stateMutability": "nonpayable",
    "inputs": [
      {"type": "address", "name": "initialOwner", "internalType": "address"},
      {"type": "uint256", "name": "initialFee", "internalType": "uint256"},
      {"type": "address", "name": "initialFeeRecipient", "internalType": "address"}
    ]
  },
  {
    "type": "error",
    "name": "EnforcedPause",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ExpectedPause",
    "inputs": []
  },
  {
    "type": "error",
    "name": "OwnableInvalidOwner",
    "inputs": [{"type": "address", "name": "owner", "internalType": "address"}]
  },
  {
    "type": "error",
    "name": "OwnableUnauthorizedAccount",
    "inputs": [{"type": "address", "name": "account", "internalType": "address"}]
  },
  {
    "type": "error",
    "name": "ReentrancyGuardReentrantCall",
    "inputs": []
  },
  {
    "type": "error",
    "name": "SafeERC20FailedOperation",
    "inputs": [{"type": "address", "name": "token", "internalType": "address"}]
  },
  {
    "type": "event",
    "name": "DistributionCompleted",
    "inputs": [
      {"type": "uint256", "name": "distributionId", "internalType": "uint256", "indexed": true},
      {"type": "address", "name": "creator", "internalType": "address", "indexed": true},
      {"type": "uint256", "name": "totalRecipients", "internalType": "uint256", "indexed": false},
      {"type": "uint256", "name": "totalValue", "internalType": "uint256", "indexed": false}
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "DistributionCreated",
    "inputs": [
      {"type": "uint256", "name": "distributionId", "internalType": "uint256", "indexed": true},
      {"type": "address", "name": "creator", "internalType": "address", "indexed": true},
      {"type": "string", "name": "name", "internalType": "string", "indexed": false},
      {"type": "uint256", "name": "totalRecipients", "internalType": "uint256", "indexed": false},
      {"type": "uint256", "name": "totalValue", "internalType": "uint256", "indexed": false}
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ERC1155BulkTransfer",
    "inputs": [
      {"type": "uint256", "name": "distributionId", "internalType": "uint256", "indexed": true},
      {"type": "address", "name": "token", "internalType": "address", "indexed": true},
      {"type": "address[]", "name": "recipients", "internalType": "address[]", "indexed": false},
      {"type": "uint256[]", "name": "tokenIds", "internalType": "uint256[]", "indexed": false},
      {"type": "uint256[]", "name": "amounts", "internalType": "uint256[]", "indexed": false}
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ERC20BulkTransfer",
    "inputs": [
      {"type": "uint256", "name": "distributionId", "internalType": "uint256", "indexed": true},
      {"type": "address", "name": "token", "internalType": "address", "indexed": true},
      {"type": "address[]", "name": "recipients", "internalType": "address[]", "indexed": false},
      {"type": "uint256[]", "name": "amounts", "internalType": "uint256[]", "indexed": false},
      {"type": "uint256", "name": "totalAmount", "internalType": "uint256", "indexed": false}
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ERC721BulkTransfer",
    "inputs": [
      {"type": "uint256", "name": "distributionId", "internalType": "uint256", "indexed": true},
      {"type": "address", "name": "token", "internalType": "address", "indexed": true},
      {"type": "address[]", "name": "recipients", "internalType": "address[]", "indexed": false},
      {"type": "uint256[]", "name": "tokenIds", "internalType": "uint256[]", "indexed": false}
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "FeeCollected",
    "inputs": [
      {"type": "address", "name": "token", "internalType": "address", "indexed": true},
      {"type": "address", "name": "recipient", "internalType": "address", "indexed": true},
      {"type": "uint256", "name": "amount", "internalType": "uint256", "indexed": false}
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {"type": "address", "name": "previousOwner", "internalType": "address", "indexed": true},
      {"type": "address", "name": "newOwner", "internalType": "address", "indexed": true}
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Paused",
    "inputs": [
      {"type": "address", "name": "account", "internalType": "address", "indexed": false}
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Unpaused",
    "inputs": [
      {"type": "address", "name": "account", "internalType": "address", "indexed": false}
    ],
    "anonymous": false
  },
  {
    "type": "function",
    "stateMutability": "nonpayable",
    "outputs": [{"type": "uint256", "name": "distributionId", "internalType": "uint256"}],
    "name": "bulkTransferERC1155",
    "inputs": [
      {
        "type": "tuple[]",
        "name": "transfers",
        "internalType": "struct IDisperzoCore.ERC1155Transfer[]",
        "components": [
          {"type": "address", "name": "token", "internalType": "address"},
          {"type": "address[]", "name": "recipients", "internalType": "address[]"},
          {"type": "uint256[]", "name": "tokenIds", "internalType": "uint256[]"},
          {"type": "uint256[]", "name": "amounts", "internalType": "uint256[]"}
        ]
      },
      {"type": "string", "name": "name", "internalType": "string"},
      {"type": "string", "name": "description", "internalType": "string"}
    ]
  },
  {
    "type": "function",
    "stateMutability": "payable",
    "outputs": [{"type": "uint256", "name": "distributionId", "internalType": "uint256"}],
    "name": "bulkTransferERC20",
    "inputs": [
      {
        "type": "tuple[]",
        "name": "transfers",
        "internalType": "struct IDisperzoCore.ERC20Transfer[]",
        "components": [
          {"type": "address", "name": "token", "internalType": "address"},
          {"type": "address[]", "name": "recipients", "internalType": "address[]"},
          {"type": "uint256[]", "name": "amounts", "internalType": "uint256[]"}
        ]
      },
      {"type": "string", "name": "name", "internalType": "string"},
      {"type": "string", "name": "description", "internalType": "string"}
    ]
  },
  {
    "type": "function",
    "stateMutability": "nonpayable",
    "outputs": [{"type": "uint256", "name": "distributionId", "internalType": "uint256"}],
    "name": "bulkTransferERC721",
    "inputs": [
      {
        "type": "tuple[]",
        "name": "transfers",
        "internalType": "struct IDisperzoCore.ERC721Transfer[]",
        "components": [
          {"type": "address", "name": "token", "internalType": "address"},
          {"type": "address[]", "name": "recipients", "internalType": "address[]"},
          {"type": "uint256[]", "name": "tokenIds", "internalType": "uint256[]"}
        ]
      },
      {"type": "string", "name": "name", "internalType": "string"},
      {"type": "string", "name": "description", "internalType": "string"}
    ]
  },
  {
    "type": "function",
    "stateMutability": "nonpayable",
    "outputs": [],
    "name": "emergencyWithdraw",
    "inputs": [
      {"type": "address", "name": "token", "internalType": "address"},
      {"type": "address", "name": "to", "internalType": "address"},
      {"type": "uint256", "name": "amount", "internalType": "uint256"}
    ]
  },
  {
    "type": "function",
    "stateMutability": "view",
    "outputs": [{"type": "uint256", "name": "", "internalType": "uint256"}],
    "name": "getCollectedFees",
    "inputs": [
      {"type": "address", "name": "token", "internalType": "address"},
      {"type": "address", "name": "recipient", "internalType": "address"}
    ]
  },
  {
    "type": "function",
    "stateMutability": "view",
    "outputs": [
      {
        "type": "tuple",
        "name": "",
        "internalType": "struct IDisperzoCore.Distribution",
        "components": [
          {"type": "uint256", "name": "id", "internalType": "uint256"},
          {"type": "address", "name": "creator", "internalType": "address"},
          {"type": "string", "name": "name", "internalType": "string"},
          {"type": "string", "name": "description", "internalType": "string"},
          {"type": "uint256", "name": "createdAt", "internalType": "uint256"},
          {"type": "uint256", "name": "totalRecipients", "internalType": "uint256"},
          {"type": "uint256", "name": "totalValue", "internalType": "uint256"},
          {"type": "bool", "name": "isActive", "internalType": "bool"},
          {"type": "bool", "name": "isCompleted", "internalType": "bool"},
          {"type": "uint256", "name": "completedAt", "internalType": "uint256"}
        ]
      }
    ],
    "name": "getDistribution",
    "inputs": [{"type": "uint256", "name": "distributionId", "internalType": "uint256"}]
  },
  {
    "type": "function",
    "stateMutability": "view",
    "outputs": [{"type": "uint256[]", "name": "", "internalType": "uint256[]"}],
    "name": "getDistributionsByCreator",
    "inputs": [{"type": "address", "name": "creator", "internalType": "address"}]
  },
  {
    "type": "function",
    "stateMutability": "view",
    "outputs": [{"type": "address", "name": "", "internalType": "address"}],
    "name": "getFeeRecipient",
    "inputs": []
  },
  {
    "type": "function",
    "stateMutability": "view",
    "outputs": [{"type": "uint256", "name": "", "internalType": "uint256"}],
    "name": "getPlatformFee",
    "inputs": []
  },
  {
    "type": "function",
    "stateMutability": "view",
    "outputs": [{"type": "uint256", "name": "", "internalType": "uint256"}],
    "name": "getTotalDistributions",
    "inputs": []
  },
  {
    "type": "function",
    "stateMutability": "payable",
    "outputs": [{"type": "uint256", "name": "distributionId", "internalType": "uint256"}],
    "name": "mixedBulkTransfer",
    "inputs": [
      {
        "type": "tuple[]",
        "name": "erc20Transfers",
        "internalType": "struct IDisperzoCore.ERC20Transfer[]",
        "components": [
          {"type": "address", "name": "token", "internalType": "address"},
          {"type": "address[]", "name": "recipients", "internalType": "address[]"},
          {"type": "uint256[]", "name": "amounts", "internalType": "uint256[]"}
        ]
      },
      {
        "type": "tuple[]",
        "name": "erc721Transfers",
        "internalType": "struct IDisperzoCore.ERC721Transfer[]",
        "components": [
          {"type": "address", "name": "token", "internalType": "address"},
          {"type": "address[]", "name": "recipients", "internalType": "address[]"},
          {"type": "uint256[]", "name": "tokenIds", "internalType": "uint256[]"}
        ]
      },
      {
        "type": "tuple[]",
        "name": "erc1155Transfers",
        "internalType": "struct IDisperzoCore.ERC1155Transfer[]",
        "components": [
          {"type": "address", "name": "token", "internalType": "address"},
          {"type": "address[]", "name": "recipients", "internalType": "address[]"},
          {"type": "uint256[]", "name": "tokenIds", "internalType": "uint256[]"},
          {"type": "uint256[]", "name": "amounts", "internalType": "uint256[]"}
        ]
      },
      {"type": "string", "name": "name", "internalType": "string"},
      {"type": "string", "name": "description", "internalType": "string"}
    ]
  },
  {
    "type": "function",
    "stateMutability": "nonpayable",
    "outputs": [{"type": "bytes4", "name": "", "internalType": "bytes4"}],
    "name": "onERC1155BatchReceived",
    "inputs": [
      {"type": "address", "name": "operator", "internalType": "address"},
      {"type": "address", "name": "from", "internalType": "address"},
      {"type": "uint256[]", "name": "ids", "internalType": "uint256[]"},
      {"type": "uint256[]", "name": "values", "internalType": "uint256[]"},
      {"type": "bytes", "name": "data", "internalType": "bytes"}
    ]
  },
  {
    "type": "function",
    "stateMutability": "nonpayable",
    "outputs": [{"type": "bytes4", "name": "", "internalType": "bytes4"}],
    "name": "onERC1155Received",
    "inputs": [
      {"type": "address", "name": "operator", "internalType": "address"},
      {"type": "address", "name": "from", "internalType": "address"},
      {"type": "uint256", "name": "id", "internalType": "uint256"},
      {"type": "uint256", "name": "value", "internalType": "uint256"},
      {"type": "bytes", "name": "data", "internalType": "bytes"}
    ]
  },
  {
    "type": "function",
    "stateMutability": "view",
    "outputs": [{"type": "address", "name": "", "internalType": "address"}],
    "name": "owner",
    "inputs": []
  },
  {
    "type": "function",
    "stateMutability": "nonpayable",
    "outputs": [],
    "name": "pause",
    "inputs": []
  },
  {
    "type": "function",
    "stateMutability": "view",
    "outputs": [{"type": "bool", "name": "", "internalType": "bool"}],
    "name": "paused",
    "inputs": []
  },
  {
    "type": "function",
    "stateMutability": "nonpayable",
    "outputs": [],
    "name": "renounceOwnership",
    "inputs": []
  },
  {
    "type": "function",
    "stateMutability": "nonpayable",
    "outputs": [],
    "name": "setFeeRecipient",
    "inputs": [{"type": "address", "name": "recipient", "internalType": "address"}]
  },
  {
    "type": "function",
    "stateMutability": "nonpayable",
    "outputs": [],
    "name": "setPlatformFee",
    "inputs": [{"type": "uint256", "name": "feePercentage", "internalType": "uint256"}]
  },
  {
    "type": "function",
    "stateMutability": "view",
    "outputs": [{"type": "bool", "name": "", "internalType": "bool"}],
    "name": "supportsInterface",
    "inputs": [{"type": "bytes4", "name": "interfaceId", "internalType": "bytes4"}]
  },
  {
    "type": "function",
    "stateMutability": "nonpayable",
    "outputs": [],
    "name": "transferOwnership",
    "inputs": [{"type": "address", "name": "newOwner", "internalType": "address"}]
  },
  {
    "type": "function",
    "stateMutability": "nonpayable",
    "outputs": [],
    "name": "unpause",
    "inputs": []
  },
  {
    "type": "function",
    "stateMutability": "nonpayable",
    "outputs": [],
    "name": "withdrawFees",
    "inputs": [
      {"type": "address", "name": "token", "internalType": "address"},
      {"type": "uint256", "name": "amount", "internalType": "uint256"}
    ]
  },
  {
    "type": "receive",
    "stateMutability": "payable"
  }
] as const;

// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  'u2u-nebulas': '0x1F017D16505E53638B00D23072F03D818518e1f3', // U2U Nebulas Testnet
  'u2u-solar': '', // U2U Solar Mainnet (to be deployed)
  'somnia-testnet': '0x231c0A24fe55834fce95f179a62ff119e02B93a6', // Somnia Testnet
} as const;

// Test token addresses for U2U Nebulas
export const TEST_TOKEN_ADDRESSES = {
  'u2u-nebulas': {
    erc20: '0x42CF3742024Df63b4aEF53345349BBFE27C8Ee96',
    erc721: '0x1eC5638B1bFDc4cE2adE3232BB27fF829c2257a3',
    erc1155: '0x3776D327a73dE005a6Cd2a29F42aCF98238F974a'
  }
} as const;

// Type definitions for contract interactions
export interface ERC20Transfer {
  token: string;
  recipients: string[];
  amounts: string[];
}

export interface ERC721Transfer {
  token: string;
  recipients: string[];
  tokenIds: string[];
}

export interface ERC1155Transfer {
  token: string;
  recipients: string[];
  tokenIds: string[];
  amounts: string[];
}

export interface Distribution {
  id: string;
  creator: string;
  name: string;
  description: string;
  createdAt: string;
  totalRecipients: string;
  totalValue: string;
  isActive: boolean;
  isCompleted: boolean;
  completedAt: string;
}

export interface DistributionParams {
  name: string;
  description: string;
  erc20Transfers?: ERC20Transfer[];
  erc721Transfers?: ERC721Transfer[];
  erc1155Transfers?: ERC1155Transfer[];
}
