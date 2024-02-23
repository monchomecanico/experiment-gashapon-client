// main tools
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

// components

// nextui
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Image,
	Modal,
	ModalBody,
	ModalContent,
	Spinner,
} from '@nextui-org/react';

// utils
import { PrizeType, getPrizeWheel } from '@/utils/toyoufrontv2';
import { getNftOrTokenMetadata } from '@/utils/getMetadata';

// solana
import { useAnchorWallet } from '@solana/wallet-adapter-react';

// styles
import classes from './styles.module.css';

// types
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import { SetStateType } from '@/types';
import { FC } from 'react';

interface Props {
	prize: any;
	visible: boolean;
	selectedWheel: any;
	setVisible: SetStateType<boolean>;
	getAllWheels: () => Promise<void>;
	setVisibleCoin: SetStateType<boolean>;
}

export const WinnerPrize: FC<Props> = ({
	prize,
	visible,
	setVisible,
	getAllWheels,
	selectedWheel,
	setVisibleCoin,
}) => {
	const wallet = useAnchorWallet();
	const [reward, setReward] = useState<any>();
	const [loading, setLoading] = useState(false);
	console.log('🎁 ~ reward:', reward, selectedWheel.publicKey.toBase58());

	//* Close Function
	const handleClose = async () => {
		try {
			setLoading(true);
			await getAllWheels();
			setVisible(false);
			setVisibleCoin(true);
			setReward(undefined);
		} catch (error) {
			console.log('🚀 ~ file: ModalPrize.tsx:37 ~ handleClose ~ error:', error);
		} finally {
			setLoading(false);
		}
	};

	const getWinnerPrize = useCallback(async () => {
		try {
			setLoading(true);
			const data = await getPrizeWheel(
				wallet as NodeWallet,
				selectedWheel.publicKey,
			);
			const dataReward = data.find(
				(item) => item.publicKey.toBase58() === prize?.reward.publicKey,
			);

			if (
				[PrizeType.Nft, PrizeType.Token].includes(dataReward?.account.typePrize!)
			) {
				const metadataReward = await getNftOrTokenMetadata(
					dataReward?.account.mint.toBase58()!,
				);

				setReward({ ...dataReward, metadata: metadataReward });
			} else setReward({ ...dataReward });
		} catch (err) {
			console.log(err);
			toast.error(String(err));
		} finally {
			setLoading(false);
		}
	}, [selectedWheel, prize, wallet]);

	useEffect(() => {
		if (visible && prize) getWinnerPrize();
	}, [getWinnerPrize, visible, prize]);

	return (
		<Modal
			isOpen={visible}
			isDismissable={false}
			onOpenChange={handleClose}
			classNames={{ base: 'bg-transparent shadow-none' }}
		>
			<ModalContent>
				<ModalBody className='relative'>
					{reward ? (
						<div className={classes.itemList}>
							<Card classNames={{ base: ' bg-transparent shadow-none' }}>
								<CardHeader className={classes.item_list_header}>
									{reward.account?.typePrize !== PrizeType.Tryagain ? (
										<h5 className={classes.subtitle}>YOU WON!</h5>
									) : (
										<h5 className={classes.subtitle}>YOU LOSE!</h5>
									)}
								</CardHeader>

								<CardBody className={`${classes.item_list_body} text-center`}>
									<div className='w-100 flex justify-center'>
										{reward.account?.typePrize === PrizeType.Sol && (
											<Image src='/assets/icons/solana.png' alt='solana' width={90} />
										)}

										{[PrizeType.Nft, PrizeType.Token].includes(
											reward.account?.typePrize,
										) && (
											<Image
												width={120}
												alt='tokens'
												src={reward.metadata.externalMetadata.image}
											/>
										)}

										{reward.account?.typePrize === PrizeType.Tryagain && (
											<Image src='/assets/icons/tryagain.png' alt='Try Again' width={90} />
										)}
									</div>
									<div className=' w-100 text-center'>
										{(reward.account?.typePrize === PrizeType.Sol ||
											reward.account?.typePrize === PrizeType.Tryagain) && (
											<h2 className={`text-uppercase ${classes.title}`}>
												{PrizeType[reward.account?.typePrize]}
											</h2>
										)}
										{(reward.account?.typePrize === PrizeType.Token ||
											reward.account?.typePrize === PrizeType.Nft) && (
											<h2 className={`${classes.title}`}>
												{reward.metadata.externalMetadata.name}
											</h2>
										)}
									</div>
									{reward.account?.typePrize === PrizeType.Sol && (
										<p className={classes.subtitle}>
											{reward.account?.prizeQuantity.toNumber() / 10 ** 9}
										</p>
									)}

									{reward.account?.typePrize === PrizeType.Token && (
										<p className={classes.subtitle}>
											{reward.account?.prizeQuantity.toNumber() /
												10 ** reward.account?.prizeDecimals}
										</p>
									)}
								</CardBody>
							</Card>
						</div>
					) : (
						<div className='flex justify-center my-5'>
							<Spinner />
						</div>
					)}

					<Button
						variant='shadow'
						disabled={loading}
						onClick={handleClose}
						style={{
							bottom: '2%',
							width: '90%',
							opacity: '1',
							position: 'absolute',
						}}
					>
						{loading ? <Spinner /> : 'Accept'}
					</Button>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
