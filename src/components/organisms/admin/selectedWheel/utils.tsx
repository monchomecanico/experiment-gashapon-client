import axios from 'axios';
import { toast } from 'react-toastify';
import { SetStateType } from '@/types';
import { base_url } from '@/utils/fetch';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import { cleanWheelBalance, forceCloseWheel } from '@/utils/toyoufrontv2';

import { PublicKey } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { NATIVE_MINT } from '@solana/spl-token';

const checktransaction = async () => {
	// if (!txHash) return toast.error('Insert tx hash');

	let parData = {
		txid:
			'47QPbWSdh81UMUvKDwh22awiU1c5DAtXvnzjnxytz1CfYbGgAFTbXT232yz2UAERRALgCbaaisWJ11Z8bp5drPbE',
	};
	// console.log(`${base_url}/fail-event-check`);
	const { data } = await axios.post(`${base_url}/fail-event-check`, parData);
	toast.info(`resultado ${data}`);
	console.log('resultado', data);
};

export const handleForceCloseWheel = async ({
	wallet,
	setloading,
	selectedWheel,
}: {
	wallet: NodeWallet;
	selectedWheel: any;
	setloading: SetStateType<boolean>;
}) => {
	try {
		setloading(true);

		const { response, error } = await forceCloseWheel(
			wallet,
			selectedWheel.publicKey,
		);
	} catch (err) {
		console.log('🚀 ~ file: index.tsx:184 ~ handleForceCloseWheel ~ err:', err);
		toast.error(String(err));
	} finally {
		setloading(false);
	}
};

export const handleCleanWheelBalance = async ({
	setLoading,
	isYouWallet,
	yourWheel,
	is_Solana,
	tokenIDWheel = NATIVE_MINT,
}: {
	yourWheel: PublicKey;
	is_Solana: boolean;
	tokenIDWheel?: PublicKey;
	isYouWallet: anchor.Wallet;
	setLoading: SetStateType<boolean>;
}) => {
	try {
		const { response, error } = await cleanWheelBalance({
			isYouWallet,
			yourWheel,
			is_Solana,
			tokenIDWheel,
		});
		if (response) {
			console.log('🚀 ~ response:', response);
			toast.success('Wheel balance cleaned');
		} else if (error) {
			console.log('🚀 ~ error:', error);
			toast.error('Error cleaning wheel balance');
		}
	} catch (err: any) {
		console.log('🚀 ~ file: index.tsx:184 ~ handleForceCloseWheel ~ err:', err);
		toast.error(String(err));
	} finally {
		setLoading(false);
	}
};
