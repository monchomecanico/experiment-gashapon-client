//main tools
import { useEffect, useState, useCallback } from 'react';

//solana
import { useAnchorWallet } from '@solana/wallet-adapter-react';

// styles
import 'react-toastify/dist/ReactToastify.css';

//types

import { FC } from 'react';
import { AppContext } from './context';

import { ToastContainer, toast } from 'react-toastify';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import { getWheels } from '@/utils/toyoufrontv2';
import { wheelStatusEnum } from '@/commons/enums';

type AppContextProviderProps = {
	children: React.ReactNode;
};

export const AppContextProvider: FC<AppContextProviderProps> = ({
	children,
}) => {
	const context = {};

	return (
		<AppContext.Provider value={context}>
			<ToastContainer closeOnClick theme='colored' position='top-center' />
			{children}
		</AppContext.Provider>
	);
};
