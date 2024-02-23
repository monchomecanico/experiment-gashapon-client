// main tools
import Head from 'next/head';

// components
import { NavbarApp } from '../navbar';

// style
import classes from './styles.module.css';

// types
import { FC, ReactNode } from 'react';
import { Footer } from '../footer';

type LayoutProps = {
	children: ReactNode;
};

export const Layout: FC<LayoutProps> = ({ children }) => {
	return (
		<div className={classes.container}>
			<Head>
				<title>Experiments Gashapon</title>
				<link rel='shortcut icon' href='/assets/coin1.webp' />
				<meta name='description' content='Yoked Yetis Gashapon' />
			</Head>

			<nav className={classes.nav}>
				<NavbarApp />
			</nav>

			<main>{children}</main>

			<footer className='absolute bottom-0 left-0 right-0'>
				<Footer />
			</footer>
		</div>
	);
};
