// main tools
import { useCallback, useMemo } from 'react';

// providers
import {
	WalletProvider,
	ConnectionProvider,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base';
import { WalletModalProvider as ReactUIWalletModalProvider } from '@solana/wallet-adapter-react-ui';

// styles
import('@solana/wallet-adapter-react-ui/styles.css' as any); //! SUPER IMPORTANTISIMO NO OLVIDAR!!!

// types
import { FC, ReactNode } from 'react';

export const WalletContextProvider: FC<{ children: ReactNode }> = ({
	children,
}) => {
	// 2. Construct the endpoint with clusterApiUrl and WalletAdapterNetwork
	const rpcUrl =
	process.env.NEXT_PUBLIC_RPC || `` ;
	const endpoint = useMemo(() => rpcUrl, [rpcUrl]);

	const wallets = useMemo(
		() => [],
		[],
	);

	const onError = useCallback((error: WalletError) => {
		console.error(error);
	}, []);

	return (
		<ConnectionProvider endpoint={endpoint}>
			<WalletProvider wallets={wallets} onError={onError}>
				<ReactUIWalletModalProvider>{children}</ReactUIWalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	);
};
