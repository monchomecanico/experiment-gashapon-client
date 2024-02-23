// providers
import { WalletContextProvider } from '@/context/WalletContextProvider';
import { AppContextProvider } from '@/context/app/provider';
import { NextUIProvider } from '@nextui-org/react';

// styles
import '@/styles/variables.css';
import '@/styles/globals.css';

// types
import type { AppProps } from 'next/app';
import { NextPage } from 'next';

type MyAppProps = {};

const MyApp: NextPage<AppProps<MyAppProps>> = ({
	Component,
	pageProps: { ...pageProps },
}) => {
	return (
		<NextUIProvider>
			<WalletContextProvider>
				<AppContextProvider>
					<Component {...pageProps} />
				</AppContextProvider>
			</WalletContextProvider>
		</NextUIProvider>
	);
};

export default MyApp;
