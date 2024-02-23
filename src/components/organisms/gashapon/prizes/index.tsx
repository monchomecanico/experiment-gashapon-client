// style
import classes from './style.module.css';
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Image,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Spinner,
	useDisclosure,
} from '@nextui-org/react';

//type
import { FC, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { PrizeType, getPrizeWheel } from '@/utils/toyoufrontv2';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import { getNftOrTokenMetadata } from '@/utils/getMetadata';
import { useAnchorWallet } from '@solana/wallet-adapter-react';

interface Props {
	index: number;
	selectedWheel: any;
}

export const Prizes: FC<Props> = ({ index, selectedWheel }) => {
	const wallet = useAnchorWallet();
	const [loading, setloading] = useState(false);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [prizeItemsList, setPrizeItemsList] = useState<any[]>();

	const totalRewards = async (data: any[]) => {
		const solPrizes = data.filter(
			(prize) => prize.account.typePrize === PrizeType.Sol,
		);
		const tryPrizes = data.filter(
			(prize) => prize.account.typePrize === PrizeType.Tryagain,
		);
		console.log('🚀 ~ totalRewards ~ tryPrizes:', tryPrizes);

		let tryPrizesAmount =
			tryPrizes.length > 0
				? {
						amount: tryPrizes.length,
						decimals: 1,
						account: { typePrize: PrizeType.Tryagain },
				  }
				: null;

		let solPrizesAmounts: any[] = [];
		solPrizes.forEach((item) => {
			const prizesExist = solPrizesAmounts.find(
				(i) =>
					i.account.prizeQuantity.toNumber() ===
					item.account.prizeQuantity.toNumber(),
			);
			if (!prizesExist)
				solPrizesAmounts.push({
					...item,
					decimals: item.account.prizeDecimals,
					amount: item.account.prizeQuantity.toNumber(),
				});
		});

		const tokenPrizes = data.filter(
			(prize) => prize.account.typePrize === PrizeType.Token,
		);

		let tokenPrizesAmounts: any[] = [];
		for (const item of tokenPrizes) {
			const prizesExist = tokenPrizesAmounts.find(
				(i) =>
					i.account.mint.toBase58() === item.account.mint.toBase58() &&
					i.account.prizeQuantity.toNumber() ===
						item.account.prizeQuantity.toNumber(),
			);

			if (!prizesExist) {
				const metadata = await getNftOrTokenMetadata(item.account.mint.toBase58());
				tokenPrizesAmounts.push({
					...item,
					metadata,
					decimals: item.account.prizeDecimals,
					amount: item.account.prizeQuantity.toNumber(),
				});
			} else {
				// const index = tokenPrizesAmounts.findIndex(
				// 	(i) => i.account.mint.toBase58() === item.account.mint.toBase58(),
				// );
				// tokenPrizesAmounts[index].amount += item.account.prizeQuantity.toNumber();
			}
		}

		let nftsWithMeta: any[] = [];

		const nfts = data.filter(
			(prize) => prize.account.typePrize === PrizeType.Nft,
		);

		for (const item of nfts) {
			const metadata = await getNftOrTokenMetadata(item.account.mint.toBase58());
			console.log(
				'🚀 ~ file: PrizeList.tsx:36 ~ tokenPrizes.forEach ~ metadata:',
				metadata,
			);
			nftsWithMeta.push({
				...item,
				metadata,
			});
		}

		return {
			solPrizesAmounts,
			tokenPrizesAmounts,
			nftsWithMeta,
			tryPrizesAmount,
		};
	};

	const getWheelPrize = useCallback(async () => {
		if (!wallet) return toast.error('Please connect your wallet');
		try {
			setloading(true);
			const data = await getPrizeWheel(
				wallet as NodeWallet,
				selectedWheel.publicKey,
			);

			const {
				solPrizesAmounts,
				tokenPrizesAmounts,
				nftsWithMeta,
				tryPrizesAmount,
			} = await totalRewards(data);

			setPrizeItemsList([
				...solPrizesAmounts,
				...tokenPrizesAmounts,
				...nftsWithMeta,
				tryPrizesAmount,
			]);
		} catch (err) {
			console.log(err);
			toast.error(String(err));
		} finally {
			setloading(false);
		}
	}, [selectedWheel, wallet]);

	useEffect(() => {
		if (isOpen && selectedWheel) getWheelPrize();
	}, [isOpen, selectedWheel, getWheelPrize]);

	return (
		<>
			<Button onPress={onOpen} className={classes.button_blue_gradient}>
				<span>Prize List</span>
				<div>
					<Image
						width={40}
						alt='prize'
						src={`/assets/${index === 0 ? 'coin1.webp' : 'coin2.png'}`}
					/>
				</div>
			</Button>

			<Modal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				size='5xl'
				placement='center'
				className='bg-opacity-60 bg-black'
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className='text-white '>Prizes</ModalHeader>
							<ModalBody className={`${classes.text}`}>
								<div className={classes.container}>
									<div className={classes.wrapperList}>
										{loading ? (
											<div>
												<Spinner />
											</div>
										) : (
											prizeItemsList?.map((item: any, index: number) => {
												if (item !== null)
													return (
														<div key={index} className={classes.itemList}>
															<Card classNames={{ base: 'bg-transparent shadow-none' }}>
																<CardHeader className={classes.item_list_header}>
																	<h5 className={classes.subtitle}>
																		{PrizeType[item.account.typePrize]}
																	</h5>
																</CardHeader>

																<CardBody className={`${classes.item_list_body} text-center`}>
																	<div className='w-100 mx-auto'>
																		{item.account.typePrize === PrizeType.Sol && (
																			<Image
																				src='/assets/icons/solana.png'
																				alt='solana'
																				width={80}
																			/>
																		)}

																		{item.account.typePrize === PrizeType.Token && (
																			<Image
																				width={80}
																				alt='tokens'
																				src={item.metadata.externalMetadata.image}
																			/>
																		)}

																		{item.account.typePrize === PrizeType.Nft && (
																			<Image
																				alt='nft'
																				width={80}
																				src={item.metadata.externalMetadata.image}
																			/>
																		)}

																		{item.account.typePrize === PrizeType.Tryagain && (
																			<Image
																				src='/assets/icons/tryagain.png'
																				alt='Try Again'
																				width={80}
																			/>
																		)}
																	</div>
																	<div className='pt-3 w-100 text-center'>
																		{item.account.typePrize === PrizeType.Sol && (
																			<h2 className={` ${classes.text}`}>
																				{PrizeType[item.account.typePrize]}
																			</h2>
																		)}
																		{(item.account.typePrize === PrizeType.Token ||
																			item.account.typePrize === PrizeType.Nft) && (
																			<h2 className={` ${classes.text}`}>
																				{item.metadata.externalMetadata.name}
																			</h2>
																		)}

																		{item.account.typePrize === PrizeType.Tryagain && (
																			<h2 className={` ${classes.text}`}>Try Again</h2>
																		)}
																	</div>
																	{item.account.typePrize === PrizeType.Sol && (
																		<p className={classes.subtitle}>
																			{item.amount / 10 ** item.decimals}
																		</p>
																	)}

																	{item.account.typePrize === PrizeType.Token && (
																		<p className={classes.subtitle}>
																			{item.amount / 10 ** item.decimals}
																		</p>
																	)}
																</CardBody>
															</Card>
														</div>
													);
											})
										)}
									</div>
								</div>
							</ModalBody>
							<ModalFooter>
								<Button className={classes.button_orange} onPress={onClose}>
									Ok
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};
