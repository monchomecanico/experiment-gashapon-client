// style
import { SetStateType } from '@/types';
import classes from './styles.module.css';

//type
import { FC, useState } from 'react';
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import { Col } from '@/components/atoms/col';
import { Spin } from '../spin';
import { WinnerPrize } from './winner-prizes';

interface Props {
	selectedWheel: any;
	getAllWheels: () => Promise<void>;
}

export const Machine: FC<Props> = ({ selectedWheel, getAllWheels }) => {
	const { publicKey } = useWallet();
	const [prize, setPrize] = useState<any>();
	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const [visibleCoin, setVisibleCoin] = useState(true);
	const [imageActive, setImageActive] = useState(false);

	const handleClick = () => {
		setImageActive(true);
		setTimeout(() => {
			setImageActive(false);
		}, 800);
	};

	return (
		<>
			<Col className={classes.img_container}>
				{!imageActive ? (
					<Image src='/assets/vending.webp' alt='vending' width={400} height={200} />
				) : (
					<Image
						className={classes.img_active}
						src='/assets/vending.webp'
						alt='vending'
						width={400}
						height={200}
					/>
				)}
			</Col>

			{publicKey && visibleCoin && (
				<div
					className={`absolute bottom-10 left-[30%] cursor-pointer z-10 flex gap-36`}
				>
					{selectedWheel?.map((wheel: any, index: number) => {
						if (
							wheel.account.turnsSold.toNumber() < wheel.account.maxPrizes.toNumber()
						)
							return (
								<div
									onClick={handleClick}
									key={`${wheel.publicKey.toBase58()}-${index}`}
								>
									<Spin
										loading={loading}
										setPrize={setPrize}
										selectedWheel={wheel}
										setLoading={setLoading}
										setVisible={setVisible}
										setVisibleCoin={setVisibleCoin}
									>
										<div
											className={classes.coin}
											style={{
												backgroundImage: `url(/assets/${
													index === 0 ? 'coin1.webp' : 'coin2.png'
												}`,
											}}
										>
											<div className={classes.tails}></div>
											<div
												className={classes.heads}
												style={{
													backgroundImage: `url(/assets/${
														index === 0 ? 'coin1.webp' : 'coin2.png'
													}`,
												}}
											></div>
										</div>

										<div
											className='text-center mt-4 text-[1.3rem]'
											style={{ color: '#fefef4' }}
										>
											Insert Coin
										</div>
									</Spin>
								</div>
							);
					})}
				</div>
			)}
			{prize &&
				selectedWheel?.map((wheel: any, index: number) => {
					if (
						wheel.account.turnsSold.toNumber() < wheel.account.maxPrizes.toNumber() &&
						prize.wheelId === wheel.publicKey.toBase58()
					)
						return (
							<WinnerPrize
								prize={prize}
								visible={visible}
								selectedWheel={wheel}
								setVisible={setVisible}
								getAllWheels={getAllWheels}
								setVisibleCoin={setVisibleCoin}
								key={`${wheel.publicKey.toBase58()}-${index}-${index}`}
							/>
						);
				})}
		</>
	);
};
