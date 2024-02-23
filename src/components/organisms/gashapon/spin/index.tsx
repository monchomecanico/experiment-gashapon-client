import { ReactNode, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

// solana
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { NATIVE_MINT } from '@solana/spl-token';

//types
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import { FC } from 'react';
import { SetStateType } from '@/types';
import { useApp } from '@/hooks/useApp';
import { base_url } from '@/utils/fetch';
import { buyTurn, pause } from '@/utils/toyoufrontv2';
import { Soporte } from '../soporteTecnito';
import { Spinner } from '@nextui-org/react';
import { verifyIsTx } from '@/commons';

interface SpinType {
	loading: boolean;
	selectedWheel: any;
	children: ReactNode;
	setPrize: SetStateType<any>;
	setLoading: SetStateType<boolean>;
	setVisible: SetStateType<boolean>;
	setVisibleCoin: SetStateType<boolean>;
}

export const Spin: FC<SpinType> = ({
	loading,
	setPrize,
	children,
	setLoading,
	setVisible,
	selectedWheel,
	setVisibleCoin,
}) => {
	const wallet = useAnchorWallet();

	const sendTicket = async (response: any) => {
		const { data } = await axios.post(`${base_url}/spin`, {
			turnTicket: response.toBase58(),
			wheelId: selectedWheel.publicKey.toBase58(),
		});
		console.log(
			'🚀 ~ file: index.tsx:40 ~ sendTicket ~ data:',
			selectedWheel.publicKey.toBase58(),
			data,
		);

		if (data.response) {
			if (verifyIsTx(data.response)) {
				setPrize({ ...data, wheelId: selectedWheel.publicKey.toBase58() });
				setVisible(true);
				setVisibleCoin(false);
				toast.success('TICKET BUY SUCCESSFULLY');
			} else {
				toast.error('TICKET BUY FAILED');
			}
		} else {
			toast.error('TICKET BUY FAILED');
			console.log(data);
		}
	};

	const SpinLootbox = async () => {
		if (!wallet) return toast.error('Please connect your wallet');

		const is_solana = true;
		const price_amount =
			Number(process.env.NEXT_PUBLIC_FEE_SOL_BUY_TURN) * 10 ** 9;
		try {
			setLoading(true);
			const { response, error } = await buyTurn(
				wallet as NodeWallet,
				selectedWheel.publicKey,
				is_solana,
				NATIVE_MINT,
				price_amount,
			);

			if (response) await sendTicket(response);
			else toast.error(String(error));
		} catch (error) {
			console.log(error);
			toast.error(String(error));
		} finally {
			await pause(1000);
			setLoading(false);
		}
	};

	return (
		<>
			<div onClick={!loading ? SpinLootbox : undefined} className='bg-transparent'>
				{!loading ? children : <Spinner color='danger' size='lg' />}
			</div>
			{/* <Soporte setPrize={setPrize} setVisibleCoin={setVisibleCoin} /> */}
		</>
	);
};
