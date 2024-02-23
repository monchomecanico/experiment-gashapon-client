// main tools
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

// components
import { Row } from '@/components/atoms/row';
import { Col } from '@/components/atoms/col';

// nextui
import { Chip, Button, Image, Spinner } from '@nextui-org/react';

// utils
import {
	PrizeType,
	getWheels,
	activeWheel,
	getPrizeWheel,
} from '@/utils/toyoufrontv2';
import { base_url } from '@/utils/fetch';

// commons
import { wheelStatusEnum } from '@/commons/enums';

// styles
import classes from './styles.module.css';

//types
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { SetStateType } from '@/types';
import { FC } from 'react';
import { base58ToString } from '@/commons';
import { handleForceCloseWheel, handleCleanWheelBalance } from './utils';
import { PublicKey } from '@solana/web3.js';
import { NATIVE_MINT } from '@solana/spl-token';

type SelectedWheelProps = {
	flag: boolean;
	selectedWheel: any;
	wheelStatus: string[];
	getAllWheels: () => Promise<void>;
	setSelectedWheel: SetStateType<any>;
	setWheelsList: SetStateType<any[] | undefined>;
};

export const SelectedWheel: FC<SelectedWheelProps> = ({
	flag,
	wheelStatus,
	selectedWheel,
	getAllWheels,
	setSelectedWheel,
}) => {
	const remainingTickets = useMemo(
		() =>
			selectedWheel?.account.maxPrizes.toNumber() -
			selectedWheel?.account.turnsSold.toNumber(),
		[selectedWheel],
	);
	const wallet = useAnchorWallet();
	const [loading, setLoading] = useState(false);
	const [prizes, setPrizes] = useState<string[]>([]);
	const [prizeData, setPrizeData] = useState<{
		decimals: number;
		amountSol: number;
		amountToken: number;
		totalPrizes: number;
		totalSolPrize: number;
		totalNftPrize: number;
		totalTokenPrize: number;
		totalTryAgainPrize: number;
		status: '';
	}>();

	const handleActivateWheel = async () => {
		if (selectedWheel.account.maxPrizes.toNumber() === 0)
			return toast.error('You need to add prizes to the wheel to activate it');
		try {
			setLoading(true);
			const { response, error } = await activeWheel(
				wallet as NodeWallet,
				selectedWheel.publicKey,
			);
			console.log(
				'🚀 ~ file: index.tsx:54 ~ handleActivateWheel ~ response:',
				response,
			);

			if (response) {
				await getAllWheels();
				setSelectedWheel(undefined);
				toast.success('Wheel Activated');
			} else {
				console.log(
					'🚀 ~ file: index.tsx:54 ~ handleActivateWheel ~ error:',
					error,
				);
				toast.error(String(error));
			}
		} catch (err) {
			console.log('🚀 ~ file: index.tsx:41 ~ handleActivateWheel ~ err:', err);
			toast.error(String(err));
		} finally {
			setLoading(false);
		}
	};

	const getAllPrizeWheel = useCallback(async () => {
		try {
			const data = await getPrizeWheel(
				wallet as NodeWallet,
				selectedWheel.publicKey,
			);

			let amountSol = 0;
			let amountToken = 0;
			let totalSolPrize = 0;
			let totalNftPrize = 0;
			let totalTokenPrize = 0;
			let totalTryAgainPrize = 0;
			let totalPrizes = data.length;
			let decimals = 0; // todo ojo

			let mintPrizes: string[] = [];

			data.forEach((prize) => {
				if (prize.account.typePrize === PrizeType.Sol) {
					amountSol += prize.account.prizeQuantity.toNumber();
					totalSolPrize++;

					if (!mintPrizes.includes(NATIVE_MINT.toBase58()))
						mintPrizes.push(NATIVE_MINT.toBase58());
				} else if (prize.account.typePrize === PrizeType.Token) {
					if (!decimals) decimals = prize.account.prizeDecimals;
					amountToken += prize.account.prizeQuantity.toNumber();
					totalTokenPrize++;

					if (!mintPrizes.includes(prize.account.mint.toBase58()))
						mintPrizes.push(prize.account.mint.toBase58());
				} else if (prize.account.typePrize === PrizeType.Nft) {
					totalNftPrize++;
				} else if (prize.account.typePrize === PrizeType.Tryagain) {
					totalTryAgainPrize++;
				}
			});

			setPrizeData({
				status: '',
				decimals,
				amountSol,
				amountToken,
				totalPrizes,
				totalSolPrize,
				totalNftPrize,
				totalTokenPrize,
				totalTryAgainPrize,
			});
			setPrizes(mintPrizes);
		} catch (error) {
			console.log(error);
			toast.error(String(error));
		}
	}, [selectedWheel, wallet]);

	const handleCleanWheelPrizesBalance = () => {
		prizes.forEach(async (prize) => {
			try {
				if (prize === NATIVE_MINT.toBase58()) {
					await handleCleanWheelBalance({
						setLoading,
						is_Solana: true,
						isYouWallet: wallet as NodeWallet,
						yourWheel: selectedWheel.publicKey,
					});
				} else {
					handleCleanWheelBalance({
						setLoading,
						is_Solana: false,
						isYouWallet: wallet as NodeWallet,
						yourWheel: selectedWheel.publicKey,
						tokenIDWheel: new PublicKey(prize),
					});
				}
			} catch (err: any) {
				console.log('🚀 ~ file: index.tsx:184 ~ handleForceCloseWheel ~ err:', err);
				toast.error(String(err));
			} finally {
				setLoading(false);
			}
		});

		toast.success('wheel cleaned successfully');
	};

	const handleCLoseWheel = async () => {
		try {
			setLoading(true);
			const { data } = await axios.post(`${base_url}/close-wheel`, {
				wheelId: selectedWheel.publicKey,
			});

			console.log('🚀 ~ file: index.tsx:100 ~ handleCLoseWheel ~ data:', data);
			if (data.error) {
				console.log('🚀 ~ handleCLoseWheel ~ data.error:', data.error);
				toast.error(String(data.error));
			} else {
				await getAllWheels();
				setSelectedWheel(undefined);
				toast.success('wheel closed successfully');
			}
		} catch (error) {
			console.log('🚀 ~ file: index.tsx:98 ~ handleCLoseWheel ~ error:', error);
			toast.error(String(error));
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getAllPrizeWheel();
	}, [getAllPrizeWheel, flag]);

	return (
		<div className={classes.container}>
			<Row className='justify-content-center'>
				<Col
					width='w-full xl:w-1/6'
					className='flex flex-col items-center xl:block '
				>
					<div>
						<div className={classes.wheelCard}>
							<Image
								alt='wheelIcon'
								src='/assets/roulette/wheel.png'
								className='z-10 w-full h-full object-contain lg:object-cover'
							/>
							<div className={classes.wrapText_selected}>
								<span className={classes.textCard}>
									{base58ToString(selectedWheel.publicKey)}
								</span>
							</div>
						</div>

						<div className='mt-3 flex justify-center '>
							<Chip color='primary' className={classes.chipText}>
								status: {wheelStatus[0]}
							</Chip>
						</div>
					</div>
				</Col>
				<Col width='w-full lg:w-5/6'>
					<div className='text-center'>
						<span className={classes.text}>
							{base58ToString(selectedWheel.publicKey)}
						</span>
						{!prizeData ? (
							<Spinner />
						) : (
							<>
								<Row className='justify-center'>
									<Col width='w-full md:w-1/5' className='d-flex justify-content-center'>
										<span
											className={classes.text}
										>{`Total Prizes: ${prizeData.totalPrizes}`}</span>
									</Col>

									<Col width='w-full md:w-1/5' className='d-flex justify-content-center'>
										<span
											className={classes.text}
										>{`Sol Prizes: ${prizeData.totalSolPrize}`}</span>
									</Col>

									<Col width='w-full md:w-1/5' className='d-flex justify-content-center'>
										<span
											className={classes.text}
										>{`Token Prizes: ${prizeData.totalTokenPrize}`}</span>
									</Col>

									<Col width='w-full md:w-1/5' className='d-flex justify-content-center'>
										<span
											className={classes.text}
										>{`Nft Prizes: ${prizeData.totalNftPrize}`}</span>
									</Col>
									<Col width='w-full md:w-1/5' className='d-flex justify-content-center'>
										<span className={classes.text}>
											{' '}
											{`TryAgain Prizes: ${prizeData.totalTryAgainPrize}`}
										</span>
									</Col>
								</Row>

								<div>
									<span className={classes.title}>Remaining tickets </span>
									<span className={classes.title}>
										{remainingTickets}/{selectedWheel?.account.maxPrizes.toNumber()}
									</span>
								</div>

								<div className='d-flex flex-column align-items-center gap-3'>
									{wheelStatus[0] === wheelStatusEnum.initial && (
										<>
											<div>
												<Button
													variant='shadow'
													disabled={loading}
													onClick={handleActivateWheel}
													className={classes.button_green_gradient}
												>
													{loading ? <Spinner color='danger' /> : 'Activate'}
												</Button>
											</div>
											<small className={classes.text}>
												4.Activate the roulette to be able to play it
											</small>
											<small className={classes.text}>
												disclaimer: Only activate the roulette after you have assigned and
												deposited the prizes
											</small>
										</>
									)}
									{wheelStatus[0] === wheelStatusEnum.active && (
										<div className='mb-5'>
											<div>
												<Button
													color='primary'
													variant='shadow'
													disabled={loading}
													onClick={handleCLoseWheel}
												>
													{loading ? <Spinner color='danger' /> : 'Close'}
												</Button>
											</div>
											<small className={classes.text}>
												The roulette will close automatically when all the tickets are sold,
												if this fails, you can close it here
											</small>
											<small className={classes.text}>
												disclaimer: You need to sell all the tickets before closing the
												wheel
											</small>
										</div>
									)}
									{wheelStatus[0] === wheelStatusEnum.closed &&
										prizes.length > 0 &&
										remainingTickets > 0 && (
											<div className='my-5 flex flex-col justify-center'>
												<div>
													<Button
														variant='shadow'
														color='secondary'
														disabled={loading}
														onClick={handleCleanWheelPrizesBalance}
													>
														{loading ? <Spinner /> : 'CLEAN BALANCE '}
													</Button>
												</div>
												<span className={classes.text}>
													Here you can withdraw the total balance of what you deposited for
													the prizes that were left unpurchased
												</span>
											</div>
										)}
									{/* //! EMERGENCY BUTTON FORCED CLOSE OR CHECK */}
									{wheelStatus[0] === wheelStatusEnum.active && (
										<div className={classes.text}>
											<div>
												<Button
													variant='shadow'
													color='secondary'
													className={classes.button_green_gradient}
													disabled={loading}
													onClick={() =>
														handleForceCloseWheel({
															setloading: setLoading,

															selectedWheel,
															wallet: wallet as NodeWallet,
														})
													}
												>
													{loading ? <Spinner /> : 'FORCED CLOSE'}
												</Button>
											</div>
											<span className='text-[14px] text-slate-100 drop-shadow-2xl'>
												Here you can force the roulette to close, in case there are unsold
												tickets and unclaimed prizes. You will be able to withdraw the total
												balance of what you added when the roulette wheel is completely
												closed.
											</span>
										</div>
									)}
								</div>
							</>
						)}
					</div>
				</Col>
			</Row>
		</div>
	);
};
