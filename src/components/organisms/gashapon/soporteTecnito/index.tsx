import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

// solana
import { useAnchorWallet } from '@solana/wallet-adapter-react';

//types
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import { FC } from 'react';
import { SetStateType } from '@/types';
import { useApp } from '@/hooks/useApp';
import { base_url } from '@/utils/fetch';
import { getBuyTurnSold, getWheels } from '@/utils/toyoufrontv2';
import { Button, Spinner } from '@nextui-org/react';
import { wheelStatusEnum } from '@/commons/enums';

interface SoporteType {
	selectedWheel: any;
	setPrize: SetStateType<any>;
	setVisibleCoin: SetStateType<boolean>;
}

export const Soporte: FC<SoporteType> = ({
	setPrize,
	setVisibleCoin,
	selectedWheel,
}) => {
	const wallet = useAnchorWallet();
	const [loading, setLoading] = useState(false);

	const sendTicket = async (response: any, wheelId?: any) => {
		const { data } = await axios.post(`${base_url}/spin`, {
			turnTicket: response,
			wheelId: wheelId ?? selectedWheel.publicKey,
		});

		if (data) {
			setPrize(data);
			setVisibleCoin(false);
			toast.success('TICKET BUY SUCCESSFULLY');
		}
	};

	const SoporteTecnico = async () => {
		try {
			setLoading(true);
			const turns = await getBuyTurnSold(wallet as NodeWallet);

			const wheels = await getWheels(
				wallet as NodeWallet,
				process.env.NEXT_PUBLIC_ADMIN_PUB_KEY,
			);

			const wheelActive = wheels.filter((wheel) => {
				const status = Object?.keys(wheel.account.status);
				if (status[0] === wheelStatusEnum.active) return wheel;
			});

			const turnsFiltered = turns.filter(
				(item) =>
					item.account.wheelId.toBase58() === wheelActive[0].publicKey.toBase58() &&
					!item.account.turnSta,
			);

			sendTicket(turnsFiltered[0].publicKey, wheelActive[0]?.publicKey);
		} catch (error) {
			console.log('🚀 ~ file: Spin.tsx:47 ~ getBuyTickets ~ error:', error);
			toast.error(String(error));
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div className='mt-5'>
				<Button
					// disabled={true}
					disabled={loading}
					onClick={SoporteTecnico}
					className='mt-5 pt-5'
				>
					{loading ? <Spinner size='sm' /> : 'SOPORTE'}
				</Button>
			</div>
		</>
	);
};
