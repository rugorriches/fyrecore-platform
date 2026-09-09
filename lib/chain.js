import { createPublicClient, http, parseAbi } from 'viem';
import { base, baseSepolia } from 'viem/chains';

/** Chain config for USDC checkout. Switch networks with NEXT_PUBLIC_CHAIN=base|base-sepolia. */
export const CHAIN = process.env.NEXT_PUBLIC_CHAIN === 'base' ? base : baseSepolia;
export const USDC = CHAIN.id === base.id ? '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' : '0x036CbD53842c5426634e7929541eC2318f3dCF7e';
export const CHECKOUT = process.env.NEXT_PUBLIC_CHECKOUT_ADDRESS || null;
export const USDC_DECIMALS = 6;

export const CHECKOUT_ABI = parseAbi([
  'function pay(bytes32 orderId, address token, uint256 amount, uint256 priceUsdCents, uint32 skuId, uint32 qty, uint256 deadline, bytes sig)',
  'function consumed(bytes32) view returns (bool)',
  'event Purchase(bytes32 indexed orderId, address indexed buyer, address indexed token, uint256 amount, uint256 priceUsdCents, uint32 skuId, uint32 qty)'
]);
export const ERC20_ABI = parseAbi([
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function balanceOf(address) view returns (uint256)'
]);

export const publicClient = () => createPublicClient({ chain: CHAIN, transport: http() });
export const isChainConfigured = () => Boolean(CHECKOUT);