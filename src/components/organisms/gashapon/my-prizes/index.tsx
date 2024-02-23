// nextui
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	ModalFooter,
	Button,
	useDisclosure,
	Spinner,
	Card,
	CardHeader,
	CardBody,
	Image,
	CardFooter,
} from '@nextui-org/react';

// style
import classes from './style.module.css';

//type
import { FC, useCallback, useEffect, useState } from 'react';
import {
	PrizeType,
	getPrizesWinnerActive,
	retrivePrize,
	retrivePrizeSol,
} from '@/utils/toyoufrontv2';
import { toast } from 'react-toastify';
import { getNftOrTokenMetadata } from '@/utils/getMetadata';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import { useAnchorWallet } from '@solana/wallet-adapter-react';

interface Props {
	selectedWheel: any;
}

export const MyPrizes: FC<Props> = ({ selectedWheel }) => {
	const wallet = useAnchorWallet();
	const [loading, setLoading] = useState(false);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [prizeItemsList, setPrizeItemsList] = useState<any[]>();

	const totalRewards = async (data: any[]) => {
		const solPrizes = data.filter(
			(prize) => prize.account.typePrize === PrizeType.Sol,
		);
		console.log('🚀 ~ totalRewards ~ solPrizes:', solPrizes);

		const tokenPrizes = data.filter(
			(prize) => prize.account.typePrize === PrizeType.Token,
		);

		const nfts = data.filter(
			(prize) => prize.account.typePrize === PrizeType.Nft,
		);

		let solPrizesAmounts: any[] = [];
		for (const item of solPrizes) {
			let existingItem = solPrizesAmounts.findIndex(
				(prize) => prize.account.prizeNum === item.account.prizeNum,
			);

			if (existingItem !== -1) {
				solPrizesAmounts[existingItem].quantity++;
			} else {
				solPrizesAmounts.push({
					...item,
					quantity: 1,
				});
			}
		}
		let tokenPrizesAmounts: any[] = [];
		for (const item of tokenPrizes) {
			let metadata;

			metadata = await getNftOrTokenMetadata(item.account?.mint?.toBase58()!);
			let existingItem = tokenPrizesAmounts.findIndex(
				(prize) => prize.account.prizeNum === item.account.prizeNum,
			);
			if (existingItem !== -1) {
				tokenPrizesAmounts[existingItem].quantity++;
			} else {
				tokenPrizesAmounts.push({
					...item,
					metadata,
					decimals: item.account.prizeDecimals,
					amount: item.account.prizeQuantity.toNumber(),
					quantity: 1,
				});
			}
		}

		let nftsWithMeta: any[] = [];

		for (const item of nfts) {
			const metadata = await getNftOrTokenMetadata(item.account.mint.toBase58());
			let existingItem = nftsWithMeta.findIndex(
				(prize) => prize.account.prizeNum === item.account.prizeNum,
			);
			if (existingItem !== -1) {
				nftsWithMeta[existingItem].quantity++;
			} else {
				nftsWithMeta.push({
					...item,
					metadata,
					quantity: 1,
				});
			}
			//console.log('🚀 ~ file: index.tsx:60 ~ totalRewards ~ metadata:', metadata);
		}

		return { solPrizesAmounts, tokenPrizesAmounts, nftsWithMeta };
	};

	const getUserPrizes = useCallback(async () => {
		if (!wallet) return toast.error('Please connect your wallet');
		try {
			setLoading(true);

			const data = await getPrizesWinnerActive(wallet as NodeWallet);

			const { solPrizesAmounts, tokenPrizesAmounts, nftsWithMeta } =
				await totalRewards(data.filter((item) => !item.account.prizeSta));

			setPrizeItemsList([
				...solPrizesAmounts,
				...tokenPrizesAmounts,
				...nftsWithMeta,
			]);
		} catch (error) {
			console.log('🚀 ~ file: index.tsx:24 ~ getUserPrizes ~ error:', error);
			toast.error(String(error));
		} finally {
			setLoading(false);
		}
	}, [wallet]);

	const claimPrizes = async (prize: any) => {
		if (!wallet) return toast.error('Please connect your wallet');

		let res;
		let err;

		try {
			setLoading(true);
			if (PrizeType.Sol === prize.account.typePrize) {
				const { response, error } = await retrivePrizeSol(
					wallet as NodeWallet,
					prize.publicKey,
				);
				if (response) res = response;
				else err = error;
			} else {
				const { response, error } = await retrivePrize(
					wallet as NodeWallet,
					prize.publicKey,
				);
				if (response) res = response;
				else err = error;
			}

			if (res) {
				toast.success('Prize claim successfully');
				await getUserPrizes();
			} else toast.error(String(err));
		} catch (err) {
			console.log('🚀 ~ file: index.tsx:43 ~ claimPrizes ~ err:', err);
			toast.error(String(err));
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (isOpen) getUserPrizes();
	}, [getUserPrizes, isOpen, wallet]);

	return (
		<>
			<Button className={classes.button_green_gradient} onPress={onOpen}>
				My Prizes
			</Button>
			<Modal
				size='5xl'
				isOpen={isOpen}
				placement='center'
				onOpenChange={onOpenChange}
				className='bg-opacity-75 bg-black'
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className='text-white'> My Prizes</ModalHeader>
							<ModalBody>
								<div className={classes.container}>
									<div className={classes.wrapperList}>
										{loading ? (
											<div>
												<Spinner />
											</div>
										) : (
											prizeItemsList?.map((item: any, index: number) => (
												<div key={index} className={classes.itemList}>
													<Card style={{ background: 'transparent' }}>
														<CardHeader className={classes.item_list_header}>
															<h5 className={classes.subtitle}>
																{PrizeType[item.account.typePrize]}
															</h5>
														</CardHeader>

														<CardBody className={`${classes.item_list_body} text-center`}>
															{/* <span className={classes.quantity}>{item.quantity}</span> */}
															<div className='w-100 flex justify-center'>
																{item.account.typePrize === PrizeType.Sol && (
																	<Image
																		alt='solana'
																		width={90}
																		src='/assets/icons/solana.png'
																	/>
																)}

																{item.account.typePrize === PrizeType.Token && (
																	<Image
																		width={50}
																		alt='Image Token'
																		src={item.metadata.externalMetadata.image}
																	/>
																)}

																{item.account.typePrize === PrizeType.Nft && (
																	<Image
																		alt='Image NFT'
																		width={50}
																		src={item.metadata.externalMetadata.image}
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
															</div>

															{item.account.typePrize === PrizeType.Sol && (
																<p className={classes.subtitle}>
																	{item.account.prizeQuantity / 10 ** 9}
																</p>
															)}

															{item.account.typePrize === PrizeType.Token && (
																<p className={classes.subtitle}>
																	{item.amount / 10 ** item.decimals}
																</p>
															)}

															<p className={classes.text}>{`Quantity: ${item.quantity}`}</p>
														</CardBody>
														<CardFooter className={classes.item_list_footer}>
															{!item.account.prizeSta && (
																<Button onClick={() => claimPrizes(item)}>Claim!</Button>
															)}
														</CardFooter>
													</Card>
												</div>
											))
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
