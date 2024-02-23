import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { PublicKey } from '@solana/web3.js';

export const base58ToString = (text: PublicKey) => text.toBase58();

export const verifyIsTx = (txHash: string) => {
	let tx;
	try {
		let validThash;
		if (txHash !== 'ya se Crearon') validThash = bs58.decode(txHash);
		return true;
	} catch (error) {
		tx = 'Signature error';
		console.log(`failEventCheck received : ${tx}`);
		return false;
	}
};
