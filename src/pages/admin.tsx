// main tools
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

// components
import { SpecialFunctions } from '@/components/organisms/admin/specialFuntions';
import { CreateWheelForm } from '@/components/organisms/admin/CreateWheel/form';
import { SelectedWheel } from '@/components/organisms/admin/selectedWheel';
import { DepositPrize } from '@/components/organisms/admin/DepositPrize';
import { SelectWheel } from '@/components/organisms/admin/SelectWheel';
import { AsignPrizes } from '@/components/organisms/admin/AsignPrizes';
import { Container } from '@/components/atoms/container';
import { Layout } from '@/components/molecules/layout';
import { Row } from '@/components/atoms/row';
import { Col } from '@/components/atoms/col';

// solana
import { useAnchorWallet } from '@solana/wallet-adapter-react';

// utils
import { getWheels } from '@/utils/toyoufrontv2';

// commons
import { wheelStatusEnum } from '@/commons/enums';

// styles
import classes from '@/styles/pages/admin.module.css';

// types
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import { NextPage } from 'next';

const AdminPanelPage: NextPage = () => {
	const wallet = useAnchorWallet();
	const [flag, setFlag] = useState(false);
	const [loading, setLoading] = useState(false);
	const [wheelsList, setWheelsList] = useState<any[]>();
	const [selectedWheel, setSelectedWheel] = useState<any>();

	const wheelStatus = useMemo(
		() => (selectedWheel ? Object?.keys(selectedWheel?.account.status) : []),
		[selectedWheel],
	);

	const checkClose = () => {
		const listActive = wheelsList?.filter((item) => {
			const status = Object?.keys(item?.account.status);
			if (status[0] !== wheelStatusEnum.closed) return item;
		}).length;

		if (!listActive) return true;

		if (listActive < 2) return true;
	};

	const checkIsAdmin = () =>
		wallet?.publicKey.toBase58() === process.env.NEXT_PUBLIC_ADMIN_PUB_KEY;

	const getAllWheels = useCallback(async () => {
		try {
			setLoading(true);
			const wheels = await getWheels(wallet as NodeWallet);

			const wheelsNotClosed = wheels.filter((wheel) => {
				const status = Object?.keys(wheel.account.status);
				if (status[0] !== wheelStatusEnum.closed) return wheel;
			});

			// sort by date
			const sortWheel = wheelsNotClosed.sort((a, b) => {
				const dateA = new Date(a.account.dateCreated.toNumber()).getTime();
				const dateB = new Date(b.account.dateCreated.toNumber()).getTime();
				return dateA < dateB ? -1 : 1;
			});

			setWheelsList(sortWheel);
		} catch (error) {
			console.log('🚀 ~ file: admin.tsx:40 ~ getAllWheels ~ error:', error);
			toast.error(String(error));
		} finally {
			setLoading(false);
		}
	}, [wallet, setLoading, setWheelsList]);

	useEffect(() => {
		if (wallet) getAllWheels();
	}, [wallet, getAllWheels]);

	if (!wallet)
		return (
			<div className={classes.background}>
				<Layout>
					<Container>
						<Row className='justify-center text-center'>
							<div>
								<h1 className={classes.subtitle}>ADMIN</h1>
								<h1 className={classes.subtitle}>connect your wallet</h1>
							</div>
						</Row>
					</Container>
				</Layout>
			</div>
		);

	if (!checkIsAdmin())
		return (
			<div className={classes.background}>
				<Layout>
					<Container>
						<Row className='justify-center text-center'>
							<div>
								<h1 className={classes.title}>ADMIN</h1>
								<h1 className={classes.subtitle}>You are not admin</h1>
							</div>
						</Row>
					</Container>
				</Layout>
			</div>
		);

	return (
		<div className={classes.background}>
			<Layout>
				<Container maxWidth='max-w-screen-2xl pb-20'>
					<Row className='flex justify-center'>
						<Col className='w-full'>
							<div className='mb-3 text-center'>
								<h1 className={classes.title}>ADMIN PANEL</h1>
								<h1 className={classes.subtitle}>
									1. Create or Select a wheel to setup
								</h1>
							</div>
						</Col>
						{checkClose() && (
							<Col width='w-full md:w-1/2'>
								<CreateWheelForm getAllWheels={getAllWheels} />
							</Col>
						)}
						<Col width='w-full md:w-1/2'>
							<SelectWheel
								loading={loading}
								wheelsList={wheelsList}
								selectedWheel={selectedWheel}
								setSelectedWheel={setSelectedWheel}
							/>
						</Col>
					</Row>

					{selectedWheel && (
						<div className='flex flex-col gap-3'>
							<SelectedWheel
								flag={flag}
								wheelStatus={wheelStatus}
								getAllWheels={getAllWheels}
								setWheelsList={setWheelsList}
								selectedWheel={selectedWheel}
								setSelectedWheel={setSelectedWheel}
							/>

							{wheelStatus![0] === 'initial' && (
								<>
									<AsignPrizes
										flag={flag}
										setFlag={setFlag}
										selectedWheel={selectedWheel}
									/>

									<DepositPrize flag={flag} selectedWheel={selectedWheel} />
								</>
							)}
							{wheelStatus[0] === 'active' && (
								<SpecialFunctions selectedWheel={selectedWheel} />
							)}
						</div>
					)}
				</Container>
			</Layout>
		</div>
	);
};

export default AdminPanelPage;
