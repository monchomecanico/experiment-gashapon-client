import { PublicKey } from '@solana/web3.js';

export const base58ToString = (text: PublicKey) => text.toBase58();
