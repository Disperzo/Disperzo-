import { http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { createConfig as createPrivyConfig } from '@privy-io/wagmi'

// Define U2U Nebulas chain
const u2uNebulas = {
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
} as const

export const config = createPrivyConfig({
  chains: [u2uNebulas, mainnet, sepolia], // U2U Nebulas first as default
  transports: {
    [u2uNebulas.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
