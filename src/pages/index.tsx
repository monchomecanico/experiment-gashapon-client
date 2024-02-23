// main tools
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';

// components
import { MyPrizes } from '@/components/organisms/gashapon/my-prizes';
import { Machine } from '@/components/organisms/gashapon/machine';
import { Prizes } from '@/components/organisms/gashapon/prizes';
import { Container } from '@/components/atoms/container';
import { Layout } from '@/components/molecules/layout';
import { Col } from '@/components/atoms/col';
import { Row } from '@/components/atoms/row';
import { Spinner } from '@nextui-org/react';

// solana
import { useAnchorWallet } from '@solana/wallet-adapter-react';

// utils
import { getWheels } from '@/utils/toyoufrontv2';
import { wheelStatusEnum } from '@/commons/enums';

//styles
import classes from '../styles/home/styles.module.css';

// types
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import { NextPage } from 'next';

const Home: NextPage = () => {
	const wallet = useAnchorWallet();
	const [loading, setLoading] = useState(false);
	const [selectedWheel, setSelectedWheel] = useState<any[]>();

	const WalletMultiButton = dynamic(
		() =>
			import('@solana/wallet-adapter-react-ui').then(
				(mod) => mod.WalletMultiButton,
			),
		{ ssr: false },
	);

	const getAllWheels = useCallback(async () => {
		try {
			setLoading(true);
			const wheels = await getWheels(
				wallet as NodeWallet,
				process.env.NEXT_PUBLIC_ADMIN_PUB_KEY,
			);

			const wheelsActive = wheels.filter((wheel) => {
				const status = Object?.keys(wheel.account.status);
				if (status[0] === wheelStatusEnum.active) return wheel;
			});

			// sort by date
			const sortWheel = wheelsActive.sort((a, b) => {
				const dateA = new Date(a.account.dateCreated.toNumber()).getTime();
				const dateB = new Date(b.account.dateCreated.toNumber()).getTime();
				return dateA < dateB ? -1 : 1;
			});

			setSelectedWheel(wheelsActive);
		} catch (error) {
			console.log('🚀 ~ file: admin.tsx:40 ~ getAllWheels ~ error:', error);
			toast.error(String(error));
		} finally {
			setLoading(false);
		}
	}, [wallet]);

	useEffect(() => {
		if (wallet) getAllWheels();
	}, [wallet, getAllWheels]);

	return (
		<Layout>
			<Container className={classes.container}>
				<Row spacing='2' className='items-center relative'>
					<Col className={classes.info}>
						<h1 className={classes.title}>
							<p>Test Your Luck With</p>
							<span>Experiments</span>
						</h1>
						<div className='flex flex-col gap-5'>
							<p className={classes.text}>
								Get ready for a burst of excitement with Yoked Yetis! Our Gashapon
								machines hold a surprise for everyone.
							</p>
							<p className={classes.text}>
								<span>Connect your wallet, Click the coin and Start winning!</span>
							</p>
						</div>

						<div className='mt-10 flex gap-10 relative z-10 max-sm:flex-col max-sm:items-left'>
							{!wallet ? (
								<div className={classes.walletButton}>
									<WalletMultiButton />
								</div>
							) : loading ? (
								<Spinner />
							) : (
								<>
									<MyPrizes selectedWheel={selectedWheel} />
									{selectedWheel?.length === 0 ? (
										<p className={classes.text}>
											<span>No active wheels</span>
										</p>
									) : (
										selectedWheel?.map((wheel, index) => {
											if (
												wheel.account.turnsSold.toNumber() <
												wheel.account.maxPrizes.toNumber()
											) {
												return (
													<Prizes
														index={index}
														selectedWheel={wheel}
														key={wheel.publicKey.toBase58()}
													/>
												);
											}
										})
									)}
								</>
							)}
						</div>
					</Col>
					<Machine getAllWheels={getAllWheels} selectedWheel={selectedWheel} />
				</Row>
			</Container>
		</Layout>
	);
};

export default Home;
