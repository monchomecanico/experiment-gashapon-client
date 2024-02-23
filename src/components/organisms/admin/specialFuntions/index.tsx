// main tools
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

// nextui
import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	Spinner,
} from '@nextui-org/react';

// utils
import { ActionLabels, actionEnums } from './utils';
import { changeCtrl, changeFee } from '@/utils/toyoufrontv2';

// solana
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

// styles
import classes from './styles.module.css';

//types
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import { FC, FormEvent } from 'react';

type SpecialFunctionsProps = {
	selectedWheel: any;
};

export const SpecialFunctions: FC<SpecialFunctionsProps> = ({
	selectedWheel,
}) => {
	const wallet = useAnchorWallet();
	const [loading, setLoading] = useState(false);
	const [inputData, setInputData] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [action, setAction] = useState<keyof typeof actionEnums>();

	const handleShowModal = useCallback(
		(command: keyof typeof actionEnums) => {
			if (command === action) setAction(undefined);
			else setAction(command);

			setShowModal(!showModal);

			console.log('handleShowModal');
		},
		[action, showModal],
	);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!inputData) return toast.error('Input cannot be empty');

		setLoading(true);
		const inputdataPublicKey = new PublicKey(inputData);
		if (action === actionEnums.CHANGE_BW) {
			try {
				const { response, error } = await changeCtrl(
					wallet as NodeWallet,
					selectedWheel.publicKey,
					inputdataPublicKey,
				);

				if (response) {
					toast.success('Changee control success');
					setInputData('');
					return;
				} else toast.error(String(error));
			} catch (err) {
				console.log('🚀 ~ file: index.tsx:41 ~ handleSubmit ~ err:', err);
				toast.error(String(err));
			} finally {
				console.log(actionEnums.CHANGE_BW);
				setLoading(false);
			}
		}

		if (action === actionEnums.CHANGE_FEE) {
			try {
				const { response, error } = await changeFee(
					wallet as NodeWallet,
					selectedWheel.publicKey,
					inputdataPublicKey,
				);

				if (response) {
					toast.success('Changee fee wallet success');
					setInputData('');
					return;
				} else toast.error(String(error));
			} catch (err) {
				console.log('🚀 ~ file: index.tsx:41 ~ handleSubmit ~ err:', err);
				toast.error(String(err));
			} finally {
				console.log(actionEnums.CHANGE_FEE);
				setLoading(false);
			}
		}
	};

	return (
		<>
			<div className={classes.container}>
				<div>
					<div className='my-3 text-center'>
						<h1 className={classes.text}>
							5.You must necessarily change the backend wallet after activating the
							roulette so that it can assign the prizes. Optionally, you can change the
							wallet that will receive the fee
						</h1>
					</div>
					<div className='flex justify-center gap-3'>
						<Button
							variant='shadow'
							color='primary'
							onClick={() =>
								handleShowModal(actionEnums.CHANGE_FEE as keyof typeof actionEnums)
							}
						>
							Change Fee Wallet
						</Button>
					</div>
				</div>
			</div>

			<Modal
				closeButton
				isOpen={showModal}
				onOpenChange={() => handleShowModal(action as keyof typeof actionEnums)}
				style={{
					backdropFilter: 'blur(10px)',
					background: 'rgba(0,0,0,0.7)',
				}}
			>
				<ModalContent>
					<ModalBody>
						<form onSubmit={handleSubmit}>
							<div>
								<label htmlFor='inputData' className={classes.label}>
									{ActionLabels(action!).label}
								</label>
								<Input
									isClearable
									id='inputData'
									className='my-3'
									value={inputData}
									onClear={() => setInputData('')}
									onChange={(e) => setInputData(e.target.value)}
									placeholder={ActionLabels(action!).placeholder}
								/>
							</div>
							<div className='flex justify-center'>
								<Button
									type='submit'
									variant='shadow'
									color='primary'
									disabled={loading}
								>
									{loading ? <Spinner color='danger' /> : 'SAVE'}
								</Button>
							</div>
						</form>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};
